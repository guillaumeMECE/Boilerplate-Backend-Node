const _ = require('lodash');

const isClientAdmin = require('$middlewares/isClientAdmin');
const errorsMessages = require('$root/etc/errorsMessages');
const { RigorousRoute, CustomError, authorizeClient } = require('$core');

const { Blacklistruleuser } = require('$models');

const settingsRoute = {
    method: 'delete', path: 'bo/admin/blacklistruleuser',
};

const middlewares = [
    authorizeClient,
    isClientAdmin,
];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            if (_.isNil(req.body.name)) {
                throw new Error('Missing rule name');
            }

            this.inputs = {
                name: req.body.name
            };

        } catch (error) {
            throw error;
        }
    }

    async process() {
        try {
            const rule = await Blacklistruleuser.findOne(this.inputs).exec();

            await rule.remove();

            return { 'deleted': 1 };

        } catch (error) {
            throw new CustomError(errorsMessages.RouteError, error);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
