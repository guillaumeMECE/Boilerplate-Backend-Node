const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull, isUnique } = require('$validators');

const modelName = 'Articletheme';

/**
 * Set schema attributes here
 */
const attributes = {
    name: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'slug')
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

schema.set('timestamps', true);

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
