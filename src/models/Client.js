const mongoose = require('mongoose');
const ClassModel = require('$core/models/ClassModel');

const { isNotNull, isUnique, isEmail, isName } = require('$validators');

const modelName = 'Client';

/**
 * Set schema attributes here
 */
const attributes = {
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: [
            isNotNull(),
            isEmail(),
            isUnique(modelName, 'email')
        ]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'username'),
        ],
    },
    firstname: {
        type: String,
        required: true,
        validate: [
            isNotNull(),
            isName()
        ]
    },
    lastname: {
        type: String,
        required: true,
        validate: [
            isNotNull(),
            isName()
        ]
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        index: true, // index because query all accepted friendship of user
        validate: isNotNull()
    },
    birthday: {
        type: Date,
        validate: isNotNull()
    },
    avatar: {
        type: String,
        required: true,
        default: 'https://api.switlish.com/storage/users/nhd/default.png', // to be replaced by a Switlish npm image hosted
        validate: isNotNull()
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client',
        required: true,
        validate: isNotNull()
    },
    is_confirmed: {
        type: Boolean,
        required: true,
        default: false,
        validate: isNotNull()
    },
    last_connection_at: {
        type: Date,
        required: true,
        default: new Date(),
        validate: isNotNull()
    },
    signed_up_at: {
        type: Date,
        required: true,
        default: new Date(),
        validate: isNotNull()
    },
    preference: {
        type: Object,
        required: true,
        default: {
            articletheme_ids: [],
        },
    },
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
