/* eslint class-methods-use-this: 0 */
const { RigorousError, errorsMessages } = require('../../errors/index');
const RigorousRoute = require('./RigorousRoute');

const formatChecker = require('../../helpers/formatChecker');
const secureInput = require('../../helpers/secureInput');

class ReadOneRoute extends RigorousRoute {

    async secure(req) {

        this.userIdAsking = req.rigorous.user.id;

        this.inputs = {
            id: secureInput.sanitizeString(req.params.id),
        };
    }

    async authorize() { /* to be overiden */ }

    async process() { /* to be overriden */ }


}

module.exports = ReadOneRoute;
