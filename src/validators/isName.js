const { formatChecker } = require('$core');

const { RigorousError, errorsMessages } = require('$core');

module.exports = () => {
    return {
        validator: (attribute) => {
            if (!formatChecker.isFirstLetterCapitalized(attribute)) {
                const errorWithAttribute = errorsMessages.ValidatorError.IsNotFirstLetterCapitalized.withAttribute(attribute.toUpperCase());
                throw new RigorousError(errorWithAttribute);
            }

            return true;
        },
        message: props => `${props.value} is not a name`,
    };
};
