const { authorizeClient, RigorousError, RigorousRoute, secureInput, formatChecker } = require('$core/index');
const isClientAdmin = require('$middlewares/isClientAdmin');
const errorsMessages = require('$root/etc/errorsMessages');

const { Brand } = require('$models');


const settingsRoute = {
    method: 'put', path: 'bo/admin/brands/:id',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.inputs = {
                id: secureInput.sanitizeString(req.params.id),
                name: secureInput.sanitizeString(req.body.name),
            };

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async authorize() {
        try {
            const { name, id } = this.inputs;

            if (formatChecker.isNil(name)) {
                throw new RigorousError(errorsMessages.InputNotConform);
            }

            if (formatChecker.isNil(id)) {
                throw new RigorousError(errorsMessages.InputNotConform);
            }

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { name, id } = this.inputs;

            const brand = await Brand.findById(id).exec();

            brand.name = name;

            const result = await brand.save();

            return result;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
