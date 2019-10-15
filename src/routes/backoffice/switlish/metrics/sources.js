const { RigorousRoute, authorizeClient } = require('$core/index');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/switlish/metrics/sources'
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

        const devicesMetrics = {
            mobile: 0,
            desktop: 0
        };

        const browsersMetrics = {
            mobile: {
                Chrome: 0,
                Firefox: 0,
                Safari: 0,
                other: 0
            },
            desktop: {
                Chrome: 0,
                Firefox: 0,
                Safari: 0,
                other: 0
            }
            
        };

        // Fetch users from Google Analytics
        const metrics = [
            { expression: 'ga:users' }
        ];

        const dimensions = [
            { name: 'ga:browser' },
            { name: 'ga:deviceCategory' },
            { name: 'ga:dimension1' } // userId
        ];

        const report = await GoogleAnalyticsReporting.fetchReport(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            metrics,
            dimensions);

        // Extract useful data from Google Analytics report
        report.data.reports[0].data.rows.forEach((row) => {
            if (row.dimensions[1] === 'mobile') {
                if (row.dimensions[0] === 'Chrome') {
                    browsersMetrics.mobile.Chrome += Number.parseInt(row.metrics[0].values[0], 10);
                } else if (row.dimensions[0] === 'Firefox') {
                    browsersMetrics.mobile.Firefox += Number.parseInt(row.metrics[0].values[0], 10);
                } else if (row.dimensions[0] === 'Safari') {
                    browsersMetrics.mobile.Safari += Number.parseInt(row.metrics[0].values[0], 10);
                } else {
                    browsersMetrics.mobile.other += Number.parseInt(row.metrics[0].values[0], 10);
                }
            } else if (row.dimensions[1] === 'desktop') {
                if (row.dimensions[0] === 'Chrome') {
                    browsersMetrics.desktop.Chrome += Number.parseInt(row.metrics[0].values[0], 10);
                } else if (row.dimensions[0] === 'Firefox') {
                    browsersMetrics.desktop.Firefox += Number.parseInt(row.metrics[0].values[0], 10);
                } else if (row.dimensions[0] === 'Safari') {
                    browsersMetrics.desktop.Safari += Number.parseInt(row.metrics[0].values[0], 10);
                } else {
                    browsersMetrics.desktop.other += Number.parseInt(row.metrics[0].values[0], 10);
                }
            }
        });

        devicesMetrics.mobile = browsersMetrics.mobile.Chrome
            + browsersMetrics.mobile.Firefox
            + browsersMetrics.mobile.Safari
            + browsersMetrics.mobile.other;

        devicesMetrics.desktop = browsersMetrics.desktop.Chrome
            + browsersMetrics.desktop.Firefox
            + browsersMetrics.desktop.Safari
            + browsersMetrics.desktop.other;

        const result = {
            devicesMetrics,
            browsersMetrics
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
