const { formatChecker, secureInput, RigorousRoute, CustomError } = require('$core/index');

const errorsMessages = require('$root/etc/errorsMessages');

const { Auth } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/auth/login'
};

const middlewares = [];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.inputs = {
                email: secureInput.sanitizeString(req.body.email),
                password: secureInput.sanitizeString(req.body.password),
            };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { email, password } = this.inputs;

            const token = await Auth.login(email, password);

            if (formatChecker.isNil(token)) {
                throw new CustomError(errorsMessages.DataNotConform);
            }

            return { token };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
