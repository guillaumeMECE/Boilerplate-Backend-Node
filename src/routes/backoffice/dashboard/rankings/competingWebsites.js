const { RigorousRoute, authorizeClient } = require('$core/index');
const { RigorousError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Swit,
    Website,
    Article,
    VoteSwit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/rankings/competing-websites'
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

        const swits = await Swit.distinct('_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('article_id').in(this.articles)
            .exec();

        const votes = await VoteSwit.distinct('vote_id')
            .where('swit_id').in(swits)
            .exec();

        const votesSwits = await VoteSwit.distinct('swit_id')
            .where('vote_id').in(votes)
            .exec();

        // Removes client swits from votes swits
        for (let i = 0; i < swits.length; i++) {
            for (let j = 0; j < votesSwits.length; j++) {
                if (votesSwits[i] && swits[i].toString() === votesSwits[j].toString()) {
                    votesSwits.splice(j, 1);
                }
            }
        }

        const ranking = await Swit.aggregate()
            .match({ _id: { $in: votesSwits } })
            .lookup({
                from: 'articles',
                localField: 'article_id',
                foreignField: '_id',
                as: 'article'
            })
            .unwind('article')
            .lookup({
                from: 'websites',
                localField: 'article.website_id',
                foreignField: '_id',
                as: 'website'
            })
            .unwind('website')
            .match({ 'website._id': { $ne: this.website._id } })
            .sortByCount('$website.url')
            .limit(3)
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
