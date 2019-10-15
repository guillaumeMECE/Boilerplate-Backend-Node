const _ = require('lodash');

const { RigorousRoute, authorizeClient } = require('$core/index');

const HTTPHelper = require('$core/helpers/http');

const {
    Friendship
} = require('$models');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/switlish/metrics/average-friends'
};
const middlewares = [
    authorizeClient
];

/**
 * Route
 */
class Route extends RigorousRoute {

    async secure(req) {

        this.timezone = HTTPHelper.parseTimezone(req);
        this.period = HTTPHelper.parsePeriod(req);
    }

    async process() {
        
        const askersFriends = await Friendship.aggregate()
            .match({ state: 'accepted' })
            .group({
                _id: '$asker_id',
                count: { $sum: 1 }
            })
            .exec();

        const receiversFriends = await Friendship.aggregate()
            .match({ state: 'accepted' })
            .group({
                _id: '$receiver_id',
                count: { $sum: 1 }
            })
            .exec();

        const usersFriends = askersFriends.concat(receiversFriends);

        // Reduce array
        for (let i = 0; i < usersFriends.length; i += 1) {
            for (let j = 0; j < usersFriends.length; j += 1) {
                if (i !== j) {
                    if (usersFriends[i]._id === usersFriends[j]._id) {
                        usersFriends[i].count += usersFriends[j].count;
                        usersFriends.splice(j, 1);
                    }
                }
            }
        }

        let averageFriendsCount = _.meanBy(usersFriends, userFriends => userFriends.count);

        averageFriendsCount = Math.round(averageFriendsCount);

        const result = {
            averageFriendsCount
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
