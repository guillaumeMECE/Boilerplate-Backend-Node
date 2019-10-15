const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
    Website,
    Article,
    Swit,
    Appreciation,
    Vote,
    VoteSwit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
    method: 'get', path: 'bo/dashboard/websites/:websiteId/feed'
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

        this.website = await Website.findOne()
            .where('_id').equals(req.params.websiteId)
            .exec();

        if (this.website === null) {
            throw new CustomError(errorsMessages.InexistentWebsiteError);
        }

        this.articles = await Article.distinct('_id')
            .where('website_id').equals(this.website._id)
            .exec();

        if (!this.articles.length) {
            throw new CustomError(errorsMessages.NoArticlesToSellError);
        }

        this.blacklistedUsers = req.blacklistedUsersIds;
    }

    async process() {

        let feed = [];

        const switsIds = await Swit.distinct('_id')
            .where('owner_id').nin(this.blacklistedUsers)
            .where('article_id').in(this.articles)
            .exec();

        const votesIds = await VoteSwit.distinct('vote_id')
            .where('swit_id').in(switsIds)
            .exec();

        const swits = await Swit.where('article_id').in(this.articles)
            .sort('-created_at')
            .limit(10)
            .exec();

        const appreciations = await Appreciation.where('swit_id').in(switsIds)
            .sort('-created_at')
            .limit(10)
            .exec();

        const votes = await Vote.where('_id').in(votesIds)
            .sort('-created_at')
            .limit(10)
            .exec();

        swits.forEach((swit) => {
            feed.push({
                type: 'swit',
                id: swit._id,
                created_at: swit.created_at
            });
        });

        appreciations.forEach((appreciation) => {
            if (appreciation.created_at > swits[swits.length - 1].created_at) {
                feed.push({
                    type: 'appreciation',
                    id: appreciation._id,
                    created_at: appreciation.created_at
                });
            }
        });

        votes.forEach((vote) => {
            if (vote.created_at > swits[swits.length - 1].created_at) {
                feed.push({
                    type: 'vote',
                    id: vote._id,
                    created_at: vote.created_at
                });
            }
        });

        // Sort feed (most recent first)
        feed.sort((a, b) => b.created_at - a.created_at);

        feed = feed.slice(0, 10);

        const result = {
            total: feed.length,
            feed
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
