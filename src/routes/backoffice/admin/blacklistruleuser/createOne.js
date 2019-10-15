const _ = require('lodash');

const isClientAdmin = require('$middlewares/isClientAdmin');
const errorsMessages = require('$root/etc/errorsMessages');
const { RigorousRoute, RigorousError, authorizeClient } = require('$core');

const { Blacklistruleuser } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/admin/blacklistruleuser',
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

            if (_.isNil(req.body.field)) {
                throw new Error('Missing blacklisted field');
            }

            if (_.isNil(req.body.regex)) {
                throw new Error('Missing regex');
            }

            this.inputs = {
                name: req.body.name,
                field: req.body.field,
                regex: req.body.regex
            };

        } catch (error) {
            throw error;
        }
    }

    async process() {
        try {
            const newRule = await Blacklistruleuser.create(this.inputs);

            return newRule;

        } catch (error) {
            throw new RigorousError(errorsMessages.RouteError, error);
        }
    }
}

module.exports = new Route(settingsRoute.method, settingsRoute.path, middlewares);
