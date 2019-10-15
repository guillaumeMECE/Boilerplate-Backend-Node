const { RigorousRoute, authorizeClient } = require('$core/index');
const { RigorousError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Swit,
    Website,
    Article
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/rankings/least-switted'
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

        const ranking = await Swit.aggregate()
            .match({
                owner_id: { $nin: this.blacklistedUsers },
                article_id: { $in: this.articles },
                created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
            })
            .group({
                _id: '$article_id',
                count: { $sum: 1 }
            })
            .sort({ count: 'ascending' })
            .limit(3)
            .lookup({
                from: 'articles',
                localField: '_id',
                foreignField: '_id',
                as: 'article'
            })
            .unwind('article')
            .project('-_id')
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
