const _ = require('lodash');

const isClientAdmin = require('$middlewares/isClientAdmin');
const populateBlacklistruleusers = require('$middlewares/populateBlacklistruleusers');

const errorsMessages = require('$root/etc/errorsMessages');
const { ReadAllRoute, RigorousRoute, RigorousError, authorizeClient } = require('$core');

const { User } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/admin/users/blacklisted',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
    populateBlacklistruleusers
];

class Route extends ReadAllRoute {

    async secure(req) {
        super.secure(req);

        try {
            this.inputs.blacklistedUsersIds = req.blacklistedUsersIds;

        } catch (error) {
            throw error;
        }
    }

    async process() {
        try {

            const { lastPaginateId, reverse } = this.inputs;

            const query = { _id: { $in: this.inputs.blacklistedUsersIds } };

            const queryPaginate = await User.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });
            

            const blacklistedUsers = await User.find(queryPaginate)
                .limit(20)
                .exec();

            return blacklistedUsers;

        } catch (error) {
            throw new RigorousError(errorsMessages.RouteError, error);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
