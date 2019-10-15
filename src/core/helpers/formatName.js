const uniqid = require('uniqid');

const { RigorousError, errorsMessages } = require('../errors/index');


function capitalizeFirstLetter(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (err) {
        throw new RigorousError(errorsMessages.InputError);
    }
}

module.exports = {

    createUsername: (firstname, lastname) => {

        if (!firstname || !lastname) {

            throw new RigorousError(errorsMessages.InputError.NullValue);
        }

        try {
            
            return `${capitalizeFirstLetter(firstname)}-${capitalizeFirstLetter(lastname)}-${uniqid()}`;
        } catch (err) {
            throw err;
        }
    },
};
