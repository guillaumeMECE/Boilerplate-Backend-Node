const { authorizeClient, ReadAllRoute, CustomError } = require('$core/index');
const isClientAdmin = require('$middlewares/isClientAdmin');

const errorsMessages = require('$root/etc/errorsMessages');

const { Website } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/admin/websites',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends ReadAllRoute {

    async process() {
        try {
            const { value, lastPaginateId, reverse } = this.inputs;

            const query = {};

            if (value) {
                query.$or = [
                    { name: { $regex: value, $options: 'i' } },
                ];
            }

            const queryPaginate = await Website.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });

            const result = await Website.find(queryPaginate)
                .limit(20)
                .exec();

            return result;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
