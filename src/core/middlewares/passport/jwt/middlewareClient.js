const passport = require('passport');

const { errorsMessages, CustomError } = require('../../../errors/index');

module.exports = {

    create: (req, res, next) => {

        // A callback is called in JWTStrategy and something create authObjectData from cb(null, auth); populating it with ._doc
        passport.authenticate('jwt',
            { 
                session: false,
            }, 
            async (err, jwtPayload) => {
                
                if (jwtPayload && jwtPayload.auth.type === 'Client') {
                
                    req.rigorous = jwtPayload;

                    next();
                } else {

                    res.status(401).json({ error: new CustomError(errorsMessages.TokenError), created_at: new Date() });
                }
        
            })(req, res, next);
    },


};
