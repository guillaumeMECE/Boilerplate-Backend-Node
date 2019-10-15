const { RigorousRoute, RigorousError, authorizeClient } = require('$core/index');

const errorsMessages = require('$root/etc/errorsMessages');

const { Auth, Client } = require('$models');

const settingsRoute = {
    method: 'delete', path: 'bo/me',
};

const middlewares = [
    authorizeClient
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.userIdAsking = req.rigorous.user.id;
            this.authIdToDelete = req.rigorous.auth.id;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async authorize() {
        try {
            // None
        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const client = await Client.findById(this.userIdAsking).exec();

            const auth = await Auth.findById(this.authIdToDelete).exec();

            if (client && auth) {
                
                await client.remove();

                await auth.remove();
            } else {
                throw new RigorousError(errorsMessages.DataNotConform);
            }

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
