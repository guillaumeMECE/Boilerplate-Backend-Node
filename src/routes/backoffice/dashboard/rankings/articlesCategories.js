const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Website,
    Article,
    Swit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/rankings/articles-categories'
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

        const articles = await Swit.distinct('article_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('article_id').in(this.articles)
            .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
            .exec();

        const ranking = await Article.aggregate()
            .match({ _id: { $in: articles } })
            .sortByCount('articlecategory_id')
            .lookup({
                from: 'articlecategorys',
                localField: '_id',
                foreignField: '_id',
                as: 'article_category'
            })
            .unwind('article_category')
            .project({
                _id: '$article_category.title',
                count: 1
            })
            .limit(5)
            .exec();

        const result = {
            ranking
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
