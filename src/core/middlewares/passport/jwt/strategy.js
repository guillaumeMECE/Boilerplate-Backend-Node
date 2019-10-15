const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Appelé automatiquement dans le middleware qui donne user qui rajoute dans la requête req.rigorous    
module.exports = (jwtCallback, jwtSecretToken) => {

    return new JWTStrategy({

        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecretToken,
    },
    jwtCallback);
};
