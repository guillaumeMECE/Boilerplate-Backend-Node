const { authorizeClient, ReadAllRoute, CustomError, secureInput } = require('$core/index');
const isClientAdmin = require('$middlewares/isClientAdmin');

const errorsMessages = require('$root/etc/errorsMessages');

const config = require('$root/config');

const { Client, ClientWebsite } = require('$models');


const settingsRoute = {
    method: 'get', path: 'bo/admin/clients/:client_id/websites',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends ReadAllRoute {

    async secure(req) {
        super.secure(req);
        try {
            const clientId = secureInput.sanitizeString(req.params.client_id);

            const client = await Client.findById(clientId).exec();

            this.inputs.client_id = client._id;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }

    async authorize() {
        this.queryAuthorization = {
            client_id: this.inputs.client_id,
        };
    }

    async process() {
        try {
            const { value, lastPaginateId, reverse, client_id } = this.inputs;

            const queryAnd = [];

            queryAnd.push(this.queryAuthorization);

            if (value) {

                queryAnd.push({
                    $or: [
                        { 'website.name': { $regex: value, $options: 'i' } },
                    ]
                });
            }

            const query = {
                $and: queryAnd,
            };

            let clientWebsiteLastPaginateId = lastPaginateId;
            console.log('clientWebsite afazf 1 ', clientWebsiteLastPaginateId)
            console.log('clientWebsite afazf config.PAGINATION_INITIAL_ID ', config.PAGINATION_INITIAL_ID)
            console.log('clientWebsite afazf config.PAGINATION_LAST_ID ', config.PAGINATION_LAST_ID)

            if (lastPaginateId !== config.PAGINATION_LAST_ID
                 && lastPaginateId !== config.PAGINATION_INITIAL_ID) {
                console.log('clientWebsite afazf 1 ', clientWebsiteLastPaginateId)

                const clientWebsite = await ClientWebsite.findOne({ website_id: lastPaginateId, client_id })
                    .select('_id')
                    .exec();
                console.log('clientWebsite afazf', clientWebsite)
                clientWebsiteLastPaginateId = clientWebsite.id;
            }

            const queryPaginate = await ClientWebsite.createQueryPaginate(query, clientWebsiteLastPaginateId, { dateField: 'created_at', reverse });

            const clientWebsites = await ClientWebsite.find(queryPaginate)
                .populate('website')
                .limit(20)
                .exec();
            
            const result = clientWebsites.map(v => v.website);

            return result;

        } catch (err) {
            throw new CustomError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
