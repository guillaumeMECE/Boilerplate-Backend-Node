const { RigorousRoute, RigorousError, OperationParams, authorizeClient } = require('$core/index');
const { formatChecker } = require('$core/index');

const errorsMessages = require('$root/etc/errorsMessages');

const { Client } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/me',
};

const middlewares = [
    authorizeClient,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.userIdAsking = req.rigorous.user.id;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const client = await Client.findById(this.userIdAsking).exec();

            if (formatChecker.isNil(client)) {
                throw new RigorousError(errorsMessages.DataNotConform);
            }

            client.last_connection_at = new Date();

            const result = await client.save();

            return result;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
