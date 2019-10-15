const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');

const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
  Article,
  Swit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/switlish/rankings/article-categories'
};
const middlewares = [
  authorizeClient,
  populateBlacklistruleusers
];

/**
 * Route
 */
class Route extends RigorousRoute {

  async secure(req) {

    this.timezone = HTTPHelper.parseTimezone(req);
    this.period = HTTPHelper.parsePeriod(req);

    this.blacklistedUsers = req.blacklistedUsersIds;
  }

  async process() {

    const articles = await Swit.distinct('article_id')
      .where('owner_id').nin(this.blacklistedUsers)
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
        articleCategory: '$article_category.title',
        count: 1,
        _id: 0
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
