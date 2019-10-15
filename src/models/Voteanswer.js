const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull } = require('$validators');

const modelName = 'Voteanswer';

/**
 * Set schema attributes here
 */
const attributes = {
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        validate: isNotNull()
    },
    swit_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        validate: isNotNull()
    },
    vote_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        validate: isNotNull()
    },
    is_private: {
        type: Boolean,
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
schema.virtual('owner', {
    ref: 'User',
    localField: 'owner_id',
    foreignField: '_id',
    justOne: true
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
