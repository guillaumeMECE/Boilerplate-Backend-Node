const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');
const AnalyticsHelper = require('$core/helpers/analytics');

const { User } = require('$models');

const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/switlish/analytics/deleted-users'
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

    const dataset = await User.aggregate()
      .match({
        _id: { $nin: this.blacklistedUsers },
        deleted_at: { $gte: this.period.startDate, $lte: this.period.endDate }
      })
      .group({
        _id: { $dateToString: { date: '$deleted_at', format: '%Y-%m-%d', timezone: this.timezone } },
        value: { $sum: 1 }
      })
      .sort({ _id: 'ascending' })
      .project({ date: '$_id', value: 1, _id: 0 })
      .exec();

    const result = {
      dimension: 'date',
      metric: 'deletedUsers',
      metricUnit: 'user',
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
