const { DeleteManyRoute, RigorousError, authorizeClient, secureInput } = require('$core/index');
const errorsMessages = require('$root/etc/errorsMessages');
const isClientAdmin = require('$middlewares/isClientAdmin');

const { Client, ClientWebsite } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/admin/clients/:client_id/remove-websites',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends DeleteManyRoute {


    async secure(req) {
        super.secure(req);
        try {
            const clientId = secureInput.sanitizeString(req.params.client_id);

            const client = await Client.findById(clientId).exec();

            this.inputs.client_id = client._id;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { ids, client_id } = this.inputs;
            const promises = [];

            for (let i = 0; i < ids.length; i += 1) {
                const id = ids[i];

                promises.push(
                    ClientWebsite.deleteOne({ website_id: id, client_id }).exec()
                );
            }

            await Promise.all(promises);

            return null;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
