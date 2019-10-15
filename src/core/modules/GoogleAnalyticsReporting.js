require('dotenv/config');

const { google } = require('googleapis');

const googleAuthJWT = new google.auth.JWT({
    email: process.env.GOOGLE_API_CLIENT_EMAIL,
    keyId: process.env.GOOGLE_API_PRIVATE_KEY_ID,
    key: process.env.GOOGLE_API_PRIVATE_KEY,
    scopes: 'https://www.googleapis.com/auth/analytics.readonly'
});

const AnalyticsReporting = google.analyticsreporting({
    auth: googleAuthJWT,
    version: 'v4'
});

module.exports = {

    fetchReport: (viewId, period, metrics, dimensions) => {
        return AnalyticsReporting.reports.batchGet({
            requestBody: {
                reportRequests: [
                    {
                        viewId: viewId,
                        dateRanges: [{
                            startDate: period.startDate,
                            endDate: period.endDate
                        }],
                        metrics,
                        dimensions
                    }
                ]
            }
        });
    },

    fetchReportWithFilters: (viewId, period, metrics, dimensions, dimensionFilterClauses) => {
        return AnalyticsReporting.reports.batchGet({
            requestBody: {
                reportRequests: [
                    {
                        viewId: viewId,
                        dateRanges: [{
                            startDate: period.startDate,
                            endDate: period.endDate
                        }],
                        metrics,
                        dimensions,
                        dimensionFilterClauses
                    }
                ]
            }
        });
    },
};
