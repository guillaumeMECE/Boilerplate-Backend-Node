const _ = require('lodash');

const isClientAdmin = require('$middlewares/isClientAdmin');
const errorsMessages = require('$root/etc/errorsMessages');
const { ReadAllRoute, RigorousRoute, CustomError, authorizeClient } = require('$core');

const { Blacklistruleuser } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/admin/blacklistruleuser',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends ReadAllRoute {

    async process() {
        try {

            const { lastPaginateId, reverse } = this.inputs;

            const query = {};

            const queryPaginate = await Blacklistruleuser.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });

            const rules = await Blacklistruleuser.find(queryPaginate)
                .limit(20)
                .exec();
            
            return rules;

        } catch (error) {
            throw new CustomError(errorsMessages.RouteError, error);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
