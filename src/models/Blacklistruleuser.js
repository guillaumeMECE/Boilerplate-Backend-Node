const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull, isUnique, isEmail } = require('$validators');

const modelName = 'Blacklistruleuser';

/**
 * Set schema attributes here
 */
const attributes = {
    regex: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    field: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    name: {
        type: String,
        required: true,
        index: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'name')
        ]
    }

};

/**
 * Set schema options here
 */
const options = {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

const schema = new mongoose.Schema(attributes, options);

/**
 * Bind virtuals fields here
 */


/**
 * Bind hooks and functions here
 */

/**
 * Load generic function like Pagination...
 */
schema.loadClass(
    class Model extends ClassModel {
        constructor() {
            super(modelName);
        }
    }
);

const model = mongoose.model(modelName, schema);

module.exports = model;
