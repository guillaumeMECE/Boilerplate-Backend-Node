const { authorizeClient, ReadAllRoute, RigorousError } = require('$core/index');
const populateWebsites = require('$middlewares/client/populateWebsites');

const errorsMessages = require('$root/etc/errorsMessages');

const { Website } = require('$models');

const settingsRoute = {
    method: 'get', path: 'bo/me/websites',
};

const middlewares = [
    authorizeClient,
    populateWebsites,
];

class Route extends ReadAllRoute {

    async secure(req) {
        super.secure(req);
        this.websiteIds = req.rigorous.websites;
    }

    async process() {
        try {
            const { value, lastPaginateId, reverse } = this.inputs;

            const query = {
                $and: [
                    { _id: { $in: this.websiteIds } }
                ]
            };

            if (value) {
                query.$and.push({
                    $or: [
                        { name: { $regex: value, $options: 'i' } }
                    ]
                });
            }

            const queryPaginate = await Website.createQueryPaginate(query, lastPaginateId, { dateField: 'created_at', reverse });

            const result = await Website.find(queryPaginate)
                .limit(20)
                .exec();

            return result;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
