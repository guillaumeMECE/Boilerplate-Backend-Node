const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull, isUnique } = require('$validators');

const modelName = 'Articlecategory';

/**
 * Set schema attributes here
 */
const attributes = {
    articletheme_slug: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'articletheme_slug')
        ]
    },
    scrapping_uuid: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'scrapping_uuid')
        ]
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'slug')
        ]
    },
    title: {
        type: String,
        required: true,
        validate: isNotNull()
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
