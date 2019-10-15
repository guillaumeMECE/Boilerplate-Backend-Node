const { RigorousRoute, authorizeClient } = require('$core/index');
const { CustomError, errorsMessages } = require('$core/errors');

const HTTPHelper = require('$core/helpers/http');
const AnalyticsHelper = require('$core/helpers/analytics');

const authorizeWebsiteAccess = require('$middlewares/authorizeWebsiteAccess');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
  Swit,
  Appreciation,
  Appreciationanswer,
  Vote,
  VoteSwit,
  Voteanswer,
  Website,
  Article
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/dashboard/websites/:websiteId/analytics/social-interactions'
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

    const swits = await Swit.distinct('_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('article_id').in(this.articles)
      .exec();

    const votes = await VoteSwit.distinct('vote_id')
      .where('swit_id').in(swits)
      .exec();

    const appreciationsDataset = await Appreciation.aggregate()
      .match({
        swit_id: { $in: swits },
        created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
      })
      .group({
        _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
        value: { $sum: 1 }
      })
      .sort({ _id: 'ascending' })
      .project({ date: '$_id', value: 1, _id: 0 })
      .exec();

    const votesDataset = await Vote.aggregate()
      .match({
        _id: { $in: votes },
        created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
      })
      .group({
        _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
        value: { $sum: 1 }
      })
      .sort({ _id: 'ascending' })
      .project({ date: '$_id', value: 1, _id: 0 })
      .exec();

    const appreciationsAnswersDataset = await Appreciationanswer.aggregate()
      .match({
        swit_id: { $in: swits },
        created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
      })
      .group({
        _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
        value: { $sum: 1 }
      })
      .sort({ _id: 'ascending' })
      .project({ date: '$_id', value: 1, _id: 0 })
      .exec();

    const votesAnswersDataset = await Voteanswer.aggregate()
      .match({
        swit_id: { $in: swits },
        created_at: { $gte: this.period.startDate, $lte: this.period.endDate }
      })
      .group({
        _id: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone: this.timezone } },
        value: { $sum: 1 }
      })
      .sort({ _id: 'ascending' })
      .project({ date: '$_id', value: 1, _id: 0 })
      .exec();

    const datasetCreations = AnalyticsHelper.merge(appreciationsDataset, votesDataset);

    const datasetAnswers = AnalyticsHelper.merge(appreciationsAnswersDataset, votesAnswersDataset);

    const dataset = AnalyticsHelper.merge(datasetCreations, datasetAnswers);

    const result = {
      dimension: 'date',
      metric: 'socialInteractions',
      metricUnit: 'interaction',
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
