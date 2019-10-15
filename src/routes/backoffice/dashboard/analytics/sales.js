const { RigorousRoute, authorizeClient } = require('$core/index');
const { RigorousError, errorsMessages } = require('$core/errors');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const HTTPHelper = require('$core/helpers/http');
const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const AnalyticsHelper = require('$core/helpers/analytics');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');

const {
    Website
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/dashboard/websites/:websiteId/analytics/sales'
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

        this.period = HTTPHelper.parsePeriod(req);
        this.timezone = HTTPHelper.parseTimezone(req);

        this.website = await Website.findOne()
            .where('_id').equals(req.params.websiteId)
            .exec();

        if (this.website === null) {
            throw new RigorousError(errorsMessages.InexistentWebsiteError);
        }

        // Specific check to Google Analytics routes
        if (this.website.ga_view_id === undefined || this.website.ga_view_id === null) {
            throw new RigorousError(errorsMessages.NoWebsiteGAViewError);
        }

        this.GoogleAnalyticsPeriod = GoogleAnalyticsHelper.formatPeriod(this.period, this.timezone);
    }

    async process() {
        
        const report = await GoogleAnalyticsReporting.fetchReport(this.website.ga_view_id,
            this.GoogleAnalyticsPeriod,
            [{ expression: 'ga:itemQuantity' }],
            [
                { name: 'ga:date' },
                { name: 'ga:transactionId' },
                { name: 'ga:dimension1' } // userId
            ]);

        const dataset = GoogleAnalyticsHelper.extractDatasetFromReport(report);

        const result = {
            dimension: 'date',
            metric: 'sales',
            metricUnit: 'soldUnit',
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
