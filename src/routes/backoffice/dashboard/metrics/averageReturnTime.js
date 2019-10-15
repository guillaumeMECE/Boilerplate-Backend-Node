const moment = require('moment-timezone');

const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');

const {
    Website,
    Article,
    Swit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/metrics/average-return-time'
};
const middlewares = [
    authorizeClient,
    authorizeWebsiteAccess
];

/**
 * Route
 */
class Route extends RigorousRoute {

    async secure(req) {

        this.timezone = HTTPHelper.parseTimezone(req);
        this.period = HTTPHelper.parsePeriod(req);

        this.website = await Website.findOne()
            .where('_id').equals(req.params.websiteId)
            .exec();

        if (this.website === null) {
            throw new CustomError(errorsMessages.InexistentWebsiteError);
        }

        this.articles = await Article.distinct('_id')
            .where('website_id').equals(this.website)
            .exec();

        if (!this.articles.length) {
            throw new CustomError(errorsMessages.NoArticlesToSellError);
        }

        this.GoogleAnalyticsPeriod = GoogleAnalyticsHelper.formatPeriod(this.period, this.timezone);

        this.blacklistedUsers = req.blacklistedUsersIds;
    }

    async process() {

        // Fetch SQL IDs of swits from database to match with Google Analytics custom report
        let switsIds = await Swit.distinct('sql_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('article_id').in(this.articles)
            .exec();
        switsIds = GoogleAnalyticsHelper.convertToString(switsIds);

        // Fetch created swits from database
        const switsCreated = await Swit.where('article_id').in(this.articles)
            .where('owner_id').nin(this.blacklistedUsers)
            .exec();

        // Fetch opened swits from Google Analytics
        const report = await GoogleAnalyticsReporting.fetchReportWithFilters(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            [{ expression: 'ga:totalEvents' }],
            [
                { name: 'ga:date' },
                { name: 'ga:dimension4' } // Swit Link
            ],
            [{
                operator: 'AND',
                filters: [
                    {
                        dimensionName: 'ga:eventAction',
                        operator: 'EXACT',
                        expressions: 'OpenLink'
                    },
                    {
                        dimensionName: 'ga:dimension4', // Swit
                        operator: 'IN_LIST',
                        expressions: switsIds
                    }
                ]
            }]);

        // Extract useful data from Google Analytics custom report
        const switsOpened = [];
        report.data.reports[0].data.rows.forEach((row) => {
            switsOpened.push({
                date: moment(row.dimensions[0]).format('YYYY-MM-DD'),
                sql_id: row.dimensions[1]
            });
        });

        // Delete duplicates from report
        for (let i = 0; i < switsOpened.length; i += 1) {
            for (let j = 0; j < switsOpened.length; j += 1) {
                if (switsOpened[i].sql_id === switsOpened[j].sql_id && i !== j) {
                    switsOpened.splice(j, 1);
                }
            }
        }

        let totalDays = 0;

        // Compute return time for each opened swit
        switsOpened.forEach((switOpened) => {
            switsCreated.forEach((switCreated) => {
                if (Number.parseInt(switOpened.sql_id, 10) === JSON.parse(JSON.stringify(switCreated)).sql_id) {
                    totalDays += moment(switOpened.date).diff(switCreated.created_at, 'days');
                }
            });
        });

        // Compute average return time
        const averageReturnTime = Math.floor(totalDays / report.data.reports[0].data.rowCount);

        const metrics = {
            averageReturnTime,
            timeUnit: 'days'
        };

        return metrics;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
