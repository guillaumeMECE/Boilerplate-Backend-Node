/* eslint class-methods-use-this: 0 */
const RigorousRoute = require('./RigorousRoute');

const secureInput = require('../../helpers/secureInput');
const formatChecker = require('../../helpers/formatChecker');

class DeleteManyRoute extends RigorousRoute {

    async secure(req) {

        this.userIdAsking = req.rigorous.user.id;

        this.inputs = {
            ids: secureInput.sanitizeString(req.body.ids),
        };
    }

    async authorize() { /* to be overiden */ }

    async process() { /* to be overriden */ }

}

module.exports = DeleteManyRoute;
