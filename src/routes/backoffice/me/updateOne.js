const { authorizeClient, CustomError, RigorousRoute, secureInput, formatChecker, OperationParams } = require('$core/index');

const errorsMessages = require('$root/etc/errorsMessages');

const { Client, Auth } = require('$models');

const settingsRoute = {
    method: 'put', path: 'bo/me',
};

const middlewares = [
    authorizeClient,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.userIdAsking = req.rigorous.user.id;

            this.inputs = {
                password: secureInput.sanitizeString(req.body.password),
            };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { password } = this.inputs;

            const auth = await Auth.findOne({ user_id: this.userIdAsking }).exec();

            if (!formatChecker.isNil(password)) {
                auth.password = password;
            }

            await auth.save();

            return null;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
