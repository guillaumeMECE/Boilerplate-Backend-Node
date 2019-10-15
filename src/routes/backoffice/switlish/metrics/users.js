const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');

const { User } = require('$models');

const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/switlish/metrics/users'
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

    const usersMetrics = await User.aggregate()
      .match({
        _id: { $nin: this.blacklistedUsers }
      })
      .project({
        age: {
          $cond: [
            { $ne: ['$birthday', null] },
            { $floor: { $divide: [{ $subtract: [new Date(), '$birthday'] }, (365 * 24 * 60 * 60 * 1000)] } },
            null
          ]
        },
        male: { $cond: { if: { $eq: ['$gender', 'male'] }, then: 1, else: 0 } },
        female: { $cond: { if: { $eq: ['$gender', 'female'] }, then: 1, else: 0 } }
      })
      .group({
        _id: null,
        male: { $sum: '$male' },
        female: { $sum: '$female' },
        total: { $sum: 1 },
        averageAge: { $avg: '$age' }
      })
      .project({
        male: 1,
        female: 1,
        total: 1,
        averageAge: { $floor: '$averageAge' },
        _id: 0
      })
      .exec();

    const result = {
      usersMetrics,
    };

    return result;
  }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
