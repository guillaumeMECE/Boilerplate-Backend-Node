const { ReadAllRoute, CustomError, OperationParams, authorizeClient } = require('$core/index');
const errorsMessages = require('$root/etc/errorsMessages');
const isClientAdmin = require('$middlewares/isClientAdmin');

const { Client } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/admin/clients'
};

const middlewares = [
    authorizeClient,
    isClientAdmin
];

class Route extends ReadAllRoute {

    async process() {
        try {
            const { value, lastPaginateId, reverse } = this.inputs;

            const query = { /* WARNING - NO AUTHORIZATION CHECK (ONLY AUTH REQUIRED) you can search anyone */ };

            if (value) {
                query.$or = [
                    { firstname: { $regex: value, $options: 'i' } },
                    { lastname: { $regex: value, $options: 'i' } },
                    { email: { $regex: value, $options: 'i' } },
                ];
            }

            const queryPaginate = await Client.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });

            const result = await Client.find(queryPaginate)
                .limit(20)
                .exec();
            
            return result;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
