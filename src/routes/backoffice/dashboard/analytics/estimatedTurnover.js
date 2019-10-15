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
    method: 'get', path: 'bo/dashboard/websites/:websiteId/analytics/estimated-turnover'
};
const middlewares = [
    authorizeClient,
    authorizeWebsiteAccess,
    populateBlacklistruleusers
];

/**
 * Route
 * @example {"data":{"dimension":"date","metric":"estimatedTurnover","metricUnit":"euro","total":7768,"dataset":[{"value":233,"date":"2019-02-06"},{"value":95,"date":"2019-02-07"},{"value":170,"date":"2019-02-08"},{"value":85,"date":"2019-02-09"},{"value":170,"date":"2019-02-10"},{"value":520,"date":"2019-02-11"},{"value":85,"date":"2019-02-17"},{"value":95,"date":"2019-02-19"},{"value":190,"date":"2019-02-20"},{"value":775,"date":"2019-02-21"},{"value":1300,"date":"2019-02-22"},{"value":85,"date":"2019-02-23"},{"value":380,"date":"2019-02-24"},{"value":425,"date":"2019-02-25"},{"value":85,"date":"2019-02-27"},{"value":625,"date":"2019-03-05"},{"value":170,"date":"2019-03-07"},{"value":85,"date":"2019-03-10"},{"value":85,"date":"2019-03-12"},{"value":255,"date":"2019-03-15"},{"value":85,"date":"2019-03-16"},{"value":85,"date":"2019-04-01"},{"value":435,"date":"2019-04-05"},{"value":180,"date":"2019-04-11"},{"value":190,"date":"2019-04-12"},{"value":85,"date":"2019-04-14"},{"value":95,"date":"2019-04-16"},{"value":85,"date":"2019-04-18"},{"value":95,"date":"2019-04-19"},{"value":85,"date":"2019-04-30"},{"value":265,"date":"2019-05-02"},{"value":85,"date":"2019-05-14"},{"value":85,"date":"2019-05-19"}]}}
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
            .lookup({
                from: 'articles',
                localField: 'article_id',
                foreignField: '_id',
                as: 'article'
            })
            .unwind('article')
            .group({
                _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
                value: { $sum: '$article.price' }
            })
            .sort({ _id: 'ascending' })
            .project({ date: '$_id', value: 1, _id: 0 })
            .exec();

        const result = {
            dimension: 'date',
            metric: 'estimatedTurnover',
            metricUnit: 'euro',
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
