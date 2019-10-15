const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const appConfig = require('$root/config');
const ClassModel = require('$core/models/ClassModel');

const errorsMessages = require('$root/etc/errorsMessages');
const { RigorousError } = require('$core');

const { isNotNull, isUnique, isEmail } = require('$validators');


const modelName = 'Auth';

/**
 * Set schema attributes here
 */
const attributes = {
    email: {
        type: String,
        required: true,
        index: true,
        validate: [
            isNotNull(),
            isEmail()
        ]
    },
    facebook_id: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: ['User', 'Client'],
        required: true,
        validate: isNotNull()
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true,
        validate: [
            isNotNull(),
            isUnique(modelName, 'user_id')
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
 * Bind methods here
 */
schema.methods.comparePassword = function (plaintext) {
    return bcrypt.compareSync(plaintext, this.password);
};

/**
 * Bind statics here
 */
schema.statics.generateTokenAuth = function (cred) {
    return new Promise((resolve, reject) => {
        try {
            const jwtPayload = {
                auth: {
                    id: cred.id,
                    type: cred.type,
                },
                user: {
                    id: cred.user_id,
                }
                /* do not use this so it is dynamically update by requesting user_id
                            email: cred.email,
                            role: user.role,
                        */
            };

            // We generate a JWT with credObject and return it
            const token = jwt.sign(jwtPayload, appConfig.JWT_SECRET_TOKEN);
            return resolve(token);

        } catch (err) {
            console.log(err);
            return reject(new RigorousError(errorsMessages.AuthenticateError, err));
        }
    });
};

schema.statics.login = function (email, password) {

    return new Promise((resolve, reject) => {

        // passport.authenticate('local', -> call the callback in the LocalStrategy that call done(err, credResult) <=> async (err, credResult) => { 
        passport.authenticate('local', async (err, credResult) => {

            try {
                console.log(' passport.authenticate ', credResult);

                if (err) {
                    console.log('err ', err);
                    return reject(new RigorousError(errorsMessages.AuthenticateError, err));
                }

                if (!credResult) {
                    return reject(new RigorousError(errorsMessages.AuthenticateError.UserNotFound, err));
                }

                const cred = credResult;
                const token = await this.generateTokenAuth(cred);
                return resolve(token);

            } catch (errOperation) {
                console.log(errOperation);
                return reject(new RigorousError(errorsMessages.AuthenticateError, err));
            }

        })({ body: { email, password } });

    });
};

/**
 * Bind hooks here
 */
schema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

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
