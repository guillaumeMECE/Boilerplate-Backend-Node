const { authorizeClient, RigorousRoute, RigorousError, secureInput } = require('$core/index');
const isClientAdmin = require('$middlewares/isClientAdmin');

const errorsMessages = require('$root/etc/errorsMessages');

const { Website } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/admin/websites',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.userIdAsking = req.rigorous.user.id;

            console.log('req ', req);
            this.inputs = {
                name: secureInput.sanitizeString(req.body.name),
                url: secureInput.sanitizeUrl(req.body.url),
                ga_view_id: secureInput.sanitizeString(req.body.ga_view_id),
            };
            console.log('inputs ', this.inputs);

        } catch (err) { console.log('azfazf ', err); throw new RigorousError(errorsMessages.RouteError, err); }
    }

    async process() {
        try {
            const { name, url, ga_view_id } = this.inputs;

            const website = await Website.create({ ga_view_id, name, url });

            return website;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
