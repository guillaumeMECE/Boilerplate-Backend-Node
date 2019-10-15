/* eslint class-methods-use-this: 0 */
const { RigorousError, errorsMessages } = require('../../errors/index');

const RigorousRoute = require('./RigorousRoute');
const rigorousConfig = require('../../config');

const formatChecker = require('../../helpers/formatChecker');
const secureInput = require('../../helpers/secureInput');

/**
 * 
 * &reverse= true|false indique la direction (depuis la fin ou depuis le début)
 * &lastPaginateId = xxxxxxxxxx (_id d'un objet de la collection) indique le point de départ
 * 
 * Note:
 * /xxxxxxx?reverse=true <=> /xxxxxxx?reverse=true&lastPaginateId=ffffffffffffffffffffffff
 * /xxxxxxx?reverse=false <=> /xxxxxxx?reverse=false&lastPaginateId=111111111111111111111111
 * 
 */

class ReadAllRoute extends RigorousRoute {

    async secure(req) {
        
        this.userIdAsking = req.rigorous.user.id;

        this.inputs = {
            reverse: (req.query.reverse === 'true'),
            lastPaginateId: secureInput.sanitizeString(req.query.lastPaginateId, true),
            value: secureInput.sanitizeString(req.query.value, true),
        };

        if (formatChecker.isNil(this.inputs.lastPaginateId)) { 
            
            this.inputs.lastPaginateId = this.inputs.reverse 
                ? rigorousConfig.PAGINATION_LAST_ID 
                : rigorousConfig.PAGINATION_INITIAL_ID;
        }
    }

    async authorize() { /* to be overiden */ }

    async process() { /* to be overriden */ }

}

module.exports = ReadAllRoute;
