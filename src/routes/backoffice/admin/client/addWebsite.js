const { RigorousRoute, RigorousError, OperationParams, authorizeClient, secureInput } = require('$core/index');
const errorsMessages = require('$root/etc/errorsMessages');
const isClientAdmin = require('$middlewares/isClientAdmin');

const { Website, Client, ClientWebsite } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/admin/clients/add-website',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            const websiteId = secureInput.sanitizeString(req.body.website_id);
            const clientId = secureInput.sanitizeString(req.body.client_id);

            const website = await Website.findById(websiteId).select('_id').exec();
            const client = await Client.findById(clientId).select('_id').exec();

            this.inputs = {
                website_id: website._id,
                client_id: client._id,
            };

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { website_id, client_id } = this.inputs;

            const clientWebsite = await ClientWebsite.create({ website_id, client_id });

            return clientWebsite;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
