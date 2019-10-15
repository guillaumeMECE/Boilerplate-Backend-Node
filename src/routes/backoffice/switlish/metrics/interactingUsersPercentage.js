const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');

const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const {
  User,
  Vote,
  Appreciation,
  Voteanswer,
  Appreciationanswer
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = {
  method: 'get', path: 'bo/switlish/metrics/interacting-users-percentage'
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

    let interactingUsers = [];

    const voteAskers = await Vote.distinct('owner_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
      .exec();

    const appreciationAskers = await Appreciation.distinct('owner_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
      .exec();

    const voteAnswerers = await Voteanswer.distinct('owner_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
      .exec();

    const appreciationAnswerers = await Appreciationanswer.distinct('owner_id')
      .where('owner_id').nin(this.blacklistedUsers)
      .where('created_at').gte(this.period.startDate).lte(this.period.endDate)
      .exec();

    interactingUsers = interactingUsers.concat(voteAskers);
    interactingUsers = interactingUsers.concat(voteAnswerers);
    interactingUsers = interactingUsers.concat(appreciationAskers);
    interactingUsers = interactingUsers.concat(appreciationAnswerers);

    // Remove duplicates owner IDs
    interactingUsers = interactingUsers.filter((item, pos) => {
      return interactingUsers.indexOf(item) === pos;
    });

    const interactingUsersPercentage = Math.round(interactingUsers.length / users.length * 100);

    const result = {
      interactingUsersPercentage
    };

    return result;
  }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
