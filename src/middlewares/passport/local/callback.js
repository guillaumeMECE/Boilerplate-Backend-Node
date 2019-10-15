const errorsMessages = require('$root/etc/errorsMessages');

const { CustomError } = require('$core');

const { Auth } = require('$models');

module.exports = async (email, password, done) => {
    try {
        const authUser = await Auth.findOne({ email }).select('email password user_id type').exec();

        if (authUser && !authUser.comparePassword(password)) {
            throw new CustomError(errorsMessages.InvalidCredentials);
        }

        done(null, authUser);

    } catch (err) {
        done(err);
    }
};
