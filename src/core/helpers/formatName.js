const uniqid = require('uniqid');

const { CustomError, errorsMessages } = require('../errors/index');


function capitalizeFirstLetter(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (err) {
        throw new CustomError(errorsMessages.InputError);
    }
}

module.exports = {

    createUsername: (firstname, lastname) => {

        if (!firstname || !lastname) {

            throw new CustomError(errorsMessages.InputError.NullValue);
        }

        try {
            
            return `${capitalizeFirstLetter(firstname)}-${capitalizeFirstLetter(lastname)}-${uniqid()}`;
        } catch (err) {
            throw err;
        }
    },
};
