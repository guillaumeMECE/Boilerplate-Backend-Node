const mongoose = require('mongoose');

const { RigorousError, errorsMessages } = require('$core');

module.exports = (modelName, attribute) => {
    return {
        async validator(value) {
            let existingDocument = null;
            const condition = { [attribute]: value };

            try {
                existingDocument = await mongoose.model(modelName).findOne(condition).exec();

            } catch (error) {
                throw new RigorousError(errorsMessages.OperationError, error);
            }

            if (existingDocument !== null && !existingDocument._id.equals(this._id)) {
                const errorWithAttribute = errorsMessages.ValidatorError.AlreadyExist.withAttribute(attribute.toUpperCase());
                throw new RigorousError(errorWithAttribute);
            }

            return true;
        },
        message: props => `${props.value} error in unique validator`,
    };
};
