const { authorizeClient, CustomError, RigorousRoute, secureInput, formatChecker } = require('$core/index');
const isClientAdmin = require('$middlewares/isClientAdmin');

const errorsMessages = require('$root/etc/errorsMessages');

const { Website } = require('$models');

const settingsRoute = {
    method: 'put', path: 'bo/admin/websites/:id',
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
                ga_view_id: secureInput.sanitizeString(req.body.ga_view_id, true)
            };

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { id, ga_view_id } = this.inputs;

            const website = await Website.findById(id).select('url image').exec();

            if (!formatChecker.isNil(ga_view_id)) {
                website.ga_view_id = ga_view_id;
            }

            const result = await website.save();

            return result;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
