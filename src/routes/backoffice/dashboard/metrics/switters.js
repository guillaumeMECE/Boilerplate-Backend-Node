const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Website,
    Article,
    User,
    Swit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/metrics/switters'
};
const middlewares = [
    authorizeClient,
    authorizeWebsiteAccess,
    populateBlacklistruleusers
];

/**
 * Route
 */
class Route extends RigorousRoute {

    async secure(req) {

        this.timezone = HTTPHelper.parseTimezone(req);
        this.period = HTTPHelper.parsePeriod(req);

        this.GoogleAnalyticsPeriod = GoogleAnalyticsHelper.formatPeriod(this.period, this.timezone);

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

        this.blacklistedUsers = req.blacklistedUsersIds;
    }

    async process() {

        const users = await Swit.distinct('owner_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('article_id').in(this.articles)
            .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
            .exec();

        const metrics = await User.aggregate()
            .match({ _id: { $in: users } })
            .project({
                age: {
                    $cond: [
                        { $ne: ['$birthday', null] },
                        { $floor: { $divide: [{ $subtract: [new Date(), '$birthday'] }, (365 * 24 * 60 * 60 * 1000)] } },
                        null
                    ]
                },
                male: { $cond: { if: { $eq: ['$gender', 'male'] }, then: 1, else: 0 } },
                female: { $cond: { if: { $eq: ['$gender', 'female'] }, then: 1, else: 0 } }
            })
            .group({
                _id: null,
                male: { $sum: '$male' },
                female: { $sum: '$female' },
                total: { $sum: 1 },
                averageAge: { $avg: '$age' }
            })
            .project({
                male: 1,
                female: 1,
                total: 1,
                averageAge: { $floor: '$averageAge' },
                _id: 0
            })
            .exec();

        // Fetch users SQL IDs from database
        let usersIds = await User.distinct('sql_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('_id').in(users)
            .where('email').ne('contact@switlish.com')
            .exec();

        usersIds = GoogleAnalyticsHelper.convertToString(usersIds);

        // Fetch users from Google Analytics
        const report = await GoogleAnalyticsReporting.fetchReportWithFilters(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            [{ expression: 'ga:users' }],
            [
                { name: 'ga:deviceCategory' }
            ],
            [{
                filters: [
                    {
                        dimensionName: 'ga:dimension1', // userId
                        operator: 'IN_LIST',
                        expressions: [usersIds]
                    }
                ]
            }]);

        const devicesMetrics = {
            mobile: 0,
            desktop: 0,
            tablet: 0
        };

        // Extract useful data from Google Analytics report
        report.data.reports[0].data.rows.forEach((row) => {
            if (row.dimensions[0] === 'desktop') {
                devicesMetrics.desktop += Number.parseInt(row.metrics[0].values[0], 10);
            } else if (row.dimensions[0] === 'mobile') {
                devicesMetrics.mobile += Number.parseInt(row.metrics[0].values[0], 10);
            } else if (row.dimensions[0] === 'tablet') {
                devicesMetrics.tablet += Number.parseInt(row.metrics[0].values[0], 10);
            }
        });

        // Compute percentage from count
        devicesMetrics.mobile = Math.floor(devicesMetrics.mobile / Number.parseInt(report.data.reports[0].data.totals[0].values[0], 10) * 100);
        devicesMetrics.desktop = Math.floor(devicesMetrics.desktop / Number.parseInt(report.data.reports[0].data.totals[0].values[0], 10) * 100);
        devicesMetrics.tablet = Math.floor(devicesMetrics.tablet / Number.parseInt(report.data.reports[0].data.totals[0].values[0], 10) * 100);

        metrics.push(devicesMetrics);

        const result = {
            metrics
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
