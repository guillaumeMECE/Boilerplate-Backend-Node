
const { authorizeClient, CustomError, RigorousRoute, secureInput, formatChecker } = require('$core');
const errorsMessages = require('$root/etc/errorsMessages');

const isClientAdmin = require('$middlewares/isClientAdmin');

const { Client, Auth } = require('$models');

const settingsRoute = {
    method: 'put', path: 'bo/admin/clients/:client_id',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.inputs = {
                client_id: secureInput.sanitizeString(req.params.client_id),
                firstname: secureInput.sanitizeString(req.body.firstname, true),
                lastname: secureInput.sanitizeString(req.body.lastname, true),
                email: secureInput.sanitizeString(req.body.email, true),
                password: secureInput.sanitizeString(req.body.password, true),
            };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { client_id, firstname, lastname, email, password } = this.inputs;

            const client = await Client.findById(client_id).exec();

            if (client !== null) {
                if (!formatChecker.isNil(firstname)) {
                    client.firstname = firstname;
                }

                if (!formatChecker.isNil(lastname)) {
                    client.lastname = lastname;
                }

                if (!formatChecker.isNil(email)) {
                    client.email = email;
                }

                const savedClient = await client.save();
                console.log('client ', savedClient);
            } else {
                throw new CustomError(errorsMessages.InexistentClient);
            }

            const auth = await Auth.findOne({ user_id: client_id }).exec();

            if (auth !== null) {
                if (!formatChecker.isNil(email)) {
                    auth.email = email;
                }

                if (!formatChecker.isNil(password)) {
                    auth.password = password;
                }

                const savedAuth = await auth.save();
            } else {
                throw new CustomError(errorsMessages.InexistentClient);
            }

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
