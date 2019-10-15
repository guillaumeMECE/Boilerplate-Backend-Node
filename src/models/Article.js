const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull, isUnique } = require('$validators');

const modelName = 'Article';

/**
 * Set schema attributes here
 */
const attributes = {
    articlebrand_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        index: true
    },
    articlecategory_id: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    currency: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    description: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    image: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    link: {
        type: String,
        unique: true,
        required: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'link')
        ]
    },
    price: {
        type: Number,
        required: true,
        validate: isNotNull()
    },
    reference: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    scrapped_at: {
        type: Date,
        required: true,
        validate: isNotNull()
    },
    scrapper_version: {
        type: Number,
        required: true,
        validate: isNotNull()
    },
    title: {
        type: String,
        required: true,
        validate: isNotNull()
    },
    website_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
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
schema.virtual('website', {
    ref: 'Website',
    localField: 'website_id',
    foreignField: '_id',
    justOne: true,
});

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
