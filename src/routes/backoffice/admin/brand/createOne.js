const isClientAdmin = require('$middlewares/isClientAdmin');

const errorsMessages = require('$root/etc/errorsMessages');

const { RigorousRoute, CustomError, secureInput, authorizeClient } = require('$core');

const { Brand } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/admin/brands',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.userIdAsking = req.rigorous.user.id;
            this.inputs = {
                name: secureInput.sanitizeString(req.body.name),
            };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { name } = this.inputs;
            const brand = await Brand.create({ name });

            return brand;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
