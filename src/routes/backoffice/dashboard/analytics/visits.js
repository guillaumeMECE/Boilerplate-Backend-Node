const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const AnalyticsHelper = require('$core/helpers/analytics');
const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');

const {
    Website
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/dashboard/websites/:websiteId/analytics/visits'
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

        this.GoogleAnalyticsPeriod = GoogleAnalyticsHelper.formatPeriod(this.period, this.timezone);
    }

    async process() {

        const report = await GoogleAnalyticsReporting.fetchReportWithFilters(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            [{ expression: 'ga:totalEvents' }],
            [
                { name: 'ga:date' },
                { name: 'ga:dimension6' } // Swit Link
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
                        dimensionName: 'ga:dimension6',
                        expressions: [this.website.url]
                    }
                ]
            }]);

        const dataset = GoogleAnalyticsHelper.extractDatasetFromReport(report);

        // We do it twice to make sure there are no duplicates left
        AnalyticsHelper.reduce(dataset);
        AnalyticsHelper.reduce(dataset);

        const result = {
            dimension: 'date',
            metric: 'visits',
            metricUnit: 'visit',
            total: AnalyticsHelper.getTotal(dataset),
            dataset
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
