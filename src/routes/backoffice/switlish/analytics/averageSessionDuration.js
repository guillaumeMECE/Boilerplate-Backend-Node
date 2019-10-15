const { RigorousRoute, authorizeClient } = require('$core/index');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const AnalyticsHelper = require('$core/helpers/analytics');
const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/switlish/analytics/average-session-duration'
};
const middlewares = [
    authorizeClient
];

/**
 * Route
 */
class Route extends RigorousRoute {

    async secure(req) {
        
        this.timezone = HTTPHelper.parseTimezone(req);
        this.period = HTTPHelper.parsePeriod(req);

        this.GoogleAnalyticsPeriod = GoogleAnalyticsHelper.formatPeriod(this.period, this.timezone);
    }

    async process() {

        const report = await GoogleAnalyticsReporting.fetchReport(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            [{ expression: 'ga:avgSessionDuration' }],
            [
                { name: 'ga:date' }
            ]);

        const dataset = GoogleAnalyticsHelper.extractDatasetFromReport(report);

        const result = {
            dimension: 'date',
            metric: 'averageSessionDuration',
            metricUnit: 'second',
            total: AnalyticsHelper.getTotal(dataset) / dataset.length,
            dataset
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
