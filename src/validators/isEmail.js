const { formatChecker } = require('$core');

const { RigorousError, errorsMessages } = require('$core');

module.exports = () => {
    return {
        validator: (attribute) => {
            if (!formatChecker.isEmail(attribute)) {
                const errorWithAttribute = errorsMessages.ValidatorError.IsNotEmail.withAttribute(attribute.toUpperCase());
                throw new RigorousError(errorWithAttribute);
            }

            return true;
        },
        message: props => `${props.value} is not an email`,
    };
};
