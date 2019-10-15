const passport = require('passport');

const { RigorousError } = require('$core');

const errorsMessages = require('$root/etc/errorsMessages');

const { User } = require('$models');

module.exports = {

    refuseAnonymous: (req, res, next) => {
    // A callback is called in JWTStrategy and something create authObjectData from cb(null, auth); populating it with ._doc
        passport.authenticate('jwt',
            {
                session: false,
            },
            async (err, jwtPayloadObjectData) => {
                try {
                    if (jwtPayloadObjectData) {
                        const rigorous = { ...jwtPayloadObjectData._doc };
                        const user = await User.findById(rigorous.id).select('role').exec();

                        if (user.role === 'anonymous') {
                            throw new RigorousError(errorsMessages.RefuseAnonymous);
                        }

                    } else {
                        throw new RigorousError(errorsMessages.InvalidToken);
                    }

                    next();

                } catch (error) {
                    res.status(401).json({ error });
                }
            })(req, res, next);
    },
};
