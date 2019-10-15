const { RigorousRoute, authorizeClient } = require('$core/index');

const GoogleAnalyticsReporting = require('$core/modules/GoogleAnalyticsReporting');

const GoogleAnalyticsHelper = require('$core/helpers/googleAnalytics');
const HTTPHelper = require('$core/helpers/http');

const config = require('$root/config');

const {
    ClientWebsite
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/switlish/metrics/widget-users-count'
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

        // Fetch all client websites
        const clientWebsites = await ClientWebsite.aggregate()
            .lookup({
                from: 'websites',
                localField: 'website_id',
                foreignField: '_id',
                as: 'website'
            })
            .unwind('website')
            .exec();
        
        // Extract websites URLs from client websites
        const websitesURLs = [];

        clientWebsites.forEach((clientWebsite) => {
            websitesURLs.push(clientWebsite.website.url);
        });

        // Fetch the number of users coming from the widget
        const metrics = [
            { expression: 'ga:pageviews' }
        ];

        const dimensions = [
            { name: 'ga:pagePath' },
            { name: 'ga:dimension1' }, // userId
            { name: 'ga:source' }
        ];

        const filters = [{
            operator: 'AND',
            filters: [
                {
                    dimensionName: 'ga:pagePath',
                    operator: 'EXACT',
                    expressions: '/onboarding/widget/desktop'
                },
                {
                    dimensionName: 'ga:source',
                    operator: 'IN_LIST',
                    expressions: websitesURLs
                }
            ]
        }];

        const report = await GoogleAnalyticsReporting.fetchReportWithFilters(config.ANALYTICS_VIEW_ID,
            this.GoogleAnalyticsPeriod,
            metrics,
            dimensions,
            filters);

        // Extract metric from the report
        const widgetUsersCount = (report.data.reports[0].data.rowCount) ? report.data.reports[0].data.rowCount : 0;

        const result = {
            widgetUsersCount
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
