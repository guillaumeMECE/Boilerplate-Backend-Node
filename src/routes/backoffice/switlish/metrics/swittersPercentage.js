const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');

const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
  User,
  Swit
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/switlish/metrics/switters-percentage'
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

    const users = await User.distinct('_id')
      .where('_id').nin(this.blacklistedUsers)
      .where('signed_up_at').lte(this.period.endDate)
      .exec();

    const switters = await Swit.distinct('owner_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
      .exec();

    const swittersPercentage = Math.round(switters.length / users.length * 100);

    const result = {
      swittersPercentage
    };

    return result;
  }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
