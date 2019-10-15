const errorsMessages = require('$root/etc/errorsMessages');
const isClientAdmin = require('$middlewares/isClientAdmin');

const { authorizeClient, ReadAllRoute, RigorousError } = require('$core/index');

const { User } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/admin/users'
};

const middlewares = [
    authorizeClient,
    isClientAdmin
];

class Route extends ReadAllRoute {

    async process() {
        try {
            const { value, lastPaginateId, reverse } = this.inputs;

            const query = {};

            if (value) {
                query.$or = [
                    { firstname: { $regex: value, $options: 'i' } },
                    { lastname: { $regex: value, $options: 'i' } },
                    { email: { $regex: value, $options: 'i' } },
                ];
            }

            const queryPaginate = await User.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });

            const result = await User.find(queryPaginate)
                .limit(20)
                .exec();
            
            return result;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
