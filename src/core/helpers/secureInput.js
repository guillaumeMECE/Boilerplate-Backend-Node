const { CustomError, errorsMessages } = require('../errors/index');
const formatChecker = require('./formatChecker');


const secure = (unitTextRaw, optional = false) => {

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#039;', // " = &quot"
        "'": '&#039;', // ' = &#039
    };

    if (!unitTextRaw) {
        if (!optional) {
            throw new CustomError(errorsMessages.UndefinedParameterInputError);
        } else {
            return null;
        }
    }

    return unitTextRaw.replace(/[&<>"']/g, (m) => { return map[m]; });

}

const sanitizeString = (unitTextRaw, optional = false) => {

    let result = null;

    if (Array.isArray(unitTextRaw)) {

        result = [];

        unitTextRaw.forEach((input) => {
            result.push(secure(input, optional));
        });

    } else {

        result = secure(unitTextRaw, optional);
    }

    return result;
}

const sanitizeUrl = (unitTextRaw, optional = false) => {

    const result = sanitizeString(unitTextRaw);

    if (result.indexOf('.') === -1) {
        throw new CustomError(errorsMessages.DataNotConform);

    }

    return result;
}

const sanitizeNumber = (number, optional = false) => {

    let result = null;

    if (Number.isInteger(number)) {
        result = number;
    } else if (!optional) {
        throw new CustomError(errorsMessages.UndefinedParameterInputError);
    }

    return result;
}

const secureName = (param, paramName, validator) => {

    const result = sanitizeString(param);

    if (!validator(result)) {
        throw new CustomError(errorsMessages.DataNotConform.withAttribute(paramName));
    }

    return result;
}

const secureEmail = (param) => {

    const result = sanitizeString(param);

    if (!formatChecker.isEmail(result)) {
        throw new CustomError(errorsMessages.DataNotConform.withAttribute('email'));
    }

    return result.toLowerCase();
}

const securePassword = (param) => {

    const result = sanitizeString(param);

    if (!formatChecker.isPassword(result)) {
        throw new CustomError(errorsMessages.DataNotConform.withAttribute('password'));
    }

    return result;
}

const secureBirthdate = (param, optional) => {

    const result = sanitizeNumber(param, optional);

    if (result && !formatChecker.isBirthdate(result)) {
        throw new CustomError(errorsMessages.DataNotConform.withAttribute('birthdate'));
    }

    return result;
}

module.exports = {

    sanitizeUrl,

    sanitizeString,

    sanitizeNumber,

    secureName,

    secureEmail,

    securePassword,

    secureBirthdate,
};
