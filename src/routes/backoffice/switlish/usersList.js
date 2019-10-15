const { RigorousRoute, authorizeClient } = require('$core/index');

const { User } = require('$models');

/**
 * Route settings
 */
const settingsRoute = { 
    method: 'get', path: 'bo/switlish/users-list'
};
const middlewares = [
    authorizeClient
];

/**
 * Route
 */
class Route extends RigorousRoute {

    async secure(req) {
        // Parse HTTP request
    }

    async process() {
        
        const users = await User.where('deleted_at').equals(null)
            .select('avatar email role')
            .exec();

        const result = {
            users
        };

        return result;
    }
}

/**
 * Route export
 */
module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
