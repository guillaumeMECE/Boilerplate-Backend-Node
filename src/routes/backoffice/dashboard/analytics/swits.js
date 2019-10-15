const { RigorousRoute, authorizeClient } = require('$core/index');
const { RigorousError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');
const AnalyticsHelper = require('$core/helpers/analytics');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Swit,
    Article,
    Website
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/analytics/swits'
};
const middlewares = [
    authorizeClient,
    authorizeWebsiteAccess,
    populateBlacklistruleusers
];

/**
 * Route
 * @example {"data":{"dimension":"date","metric":"swits","metricUnit":"swit","total":87,"dataset":[{"value":2,"date":"2019-02-06"},{"value":1,"date":"2019-02-07"},{"value":2,"date":"2019-02-08"},{"value":1,"date":"2019-02-09"},{"value":2,"date":"2019-02-10"},{"value":6,"date":"2019-02-11"},{"value":1,"date":"2019-02-17"},{"value":1,"date":"2019-02-19"},{"value":2,"date":"2019-02-20"},{"value":9,"date":"2019-02-21"},{"value":14,"date":"2019-02-22"},{"value":1,"date":"2019-02-23"},{"value":4,"date":"2019-02-24"},{"value":5,"date":"2019-02-25"},{"value":1,"date":"2019-02-27"},{"value":7,"date":"2019-03-05"},{"value":2,"date":"2019-03-07"},{"value":1,"date":"2019-03-10"},{"value":1,"date":"2019-03-12"},{"value":3,"date":"2019-03-15"},{"value":1,"date":"2019-03-16"},{"value":1,"date":"2019-04-01"},{"value":5,"date":"2019-04-05"},{"value":2,"date":"2019-04-11"},{"value":2,"date":"2019-04-12"},{"value":1,"date":"2019-04-14"},{"value":1,"date":"2019-04-16"},{"value":1,"date":"2019-04-18"},{"value":1,"date":"2019-04-19"},{"value":1,"date":"2019-04-30"},{"value":3,"date":"2019-05-02"},{"value":1,"date":"2019-05-14"},{"value":1,"date":"2019-05-19"}]}}
 */
class Route extends RigorousRoute {

    async secure(req) {

        this.timezone = HTTPHelper.parseTimezone(req);
        this.period = HTTPHelper.parsePeriod(req);

        this.website = await Website.findOne()
            .where('_id').equals(req.params.websiteId)
            .exec();

        if (this.website === null) {
            throw new RigorousError(errorsMessages.InexistentWebsiteError);
        }

        this.articles = await Article.distinct('_id')
            .where('website_id').equals(this.website)
            .exec();

        if (!this.articles.length) {
            throw new RigorousError(errorsMessages.NoArticlesToSellError);
        }

        this.blacklistedUsers = req.blacklistedUsersIds;
    }

    async process() {

        const dataset = await Swit.aggregate()
            .match({
                owner_id: { $nin: this.blacklistedUsers },
                article_id: { $in: this.articles },
                created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
            })
            .group({
                _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
                value: { $sum: 1 }
            })
            .sort({ _id: 'ascending' })
            .project({ date: '$_id', value: 1, _id: 0 })
            .exec();

        const result = {
            dimension: 'date',
            metric: 'swits',
            metricUnit: 'swit',
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
