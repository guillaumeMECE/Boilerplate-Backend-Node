const uniqid = require('uniqid');

module.exports = class RigorousError extends Error {

    constructor(errorName, detailError = null) {
        super();

        this.id = uniqid();
        this.date = new Date();

        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            this.name = errorName.dev;
            this.detail = detailError;

            if (!detailError) {
                this.stackTrace = this.stack;
            }
        } else {
            this.name = errorName.prod === '' ? 'GENERIC_ERROR' : errorName.prod;
            this.detail = null;
        }

        if (detailError) {

            // We keep only the deepest reasons
            this.reasons = detailError.reasons || [detailError.name];

            if (detailError.name === 'ValidationError') {

                Object.values(detailError.errors).forEach((value) => {

                    if (value && value.reason) {
                        this.reasons.push(value.reason.name);
                    }
                });
            }

        } else {
            this.reasons = null;
        }
    }
};
