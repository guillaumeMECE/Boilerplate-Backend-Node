const { RigorousError, errorsMessages } = require('../errors/index');
const formatChecker = require('./formatChecker');


function secure(unitTextRaw, optional = false) {

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#039;', // " = &quot"
        "'": '&#039;', // ' = &#039
    };

    if (!unitTextRaw) {
        if (!optional) {
            throw new RigorousError(errorsMessages.UndefinedParameterInputError);
        } else {
            return null;
        }
    }

    return unitTextRaw.replace(/[&<>"']/g, (m) => { return map[m]; });

}

function sanitizeString(unitTextRaw, optional = false)  {

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

function sanitizeUrl(unitTextRaw, optional = false)  {

    const result = sanitizeString(unitTextRaw);
    
    if (result.indexOf('.') === -1) {
        throw new RigorousError(errorsMessages.DataNotConform);
        
    }

    return result;
}

function sanitizeNumber(number, optional = false) {

    let result = null;

    if (Number.isInteger(number)) {
        result = number;
    } else if (!optional) {
        throw new RigorousError(errorsMessages.UndefinedParameterInputError);
    }

    return result;
}
module.exports = {
    
    sanitizeUrl,

    sanitizeString,

    sanitizeNumber,

    secureName: (param, paramName, validator) => {
        
        const result = sanitizeString(param);

        if (!validator(result)) {
            throw new RigorousError(errorsMessages.DataNotConform.withAttribute(paramName));
        }

        return result;
    },

    secureEmail: (param) => {
        
        const result = sanitizeString(param);

        if (!formatChecker.isEmail(result)) {
            throw new RigorousError(errorsMessages.DataNotConform.withAttribute('email'));
        }

        return result.toLowerCase();
    },

    securePassword: (param) => {
        
        const result = sanitizeString(param);

        if (!formatChecker.isPassword(result)) {
            throw new RigorousError(errorsMessages.DataNotConform.withAttribute('password'));
        }

        return result;
    },

    secureBirthdate: (param, optional) => {
        
        const result = sanitizeNumber(param, optional);

        if (result && !formatChecker.isBirthdate(result)) {
            throw new RigorousError(errorsMessages.DataNotConform.withAttribute('birthdate'));
        }

        return result;
    }
};
