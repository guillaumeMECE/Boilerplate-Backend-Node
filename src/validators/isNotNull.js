const { formatChecker } = require('$core');

const { RigorousError, errorsMessages } = require('$core');

module.exports = () => {
    return {
        validator: (attribute) => {
            if (formatChecker.isNil(attribute)) {
                const errorWithAttribute = errorsMessages.ValidatorError.IsNull.withAttribute(attribute.toUpperCase());
                throw new RigorousError(errorWithAttribute);
            }

            return true;
        },
        message: props => `${props.value} should not be null`,
    };
};
