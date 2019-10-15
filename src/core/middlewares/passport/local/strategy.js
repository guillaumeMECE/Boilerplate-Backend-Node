const LocalStrategy = require('passport-local').Strategy;

/**
 * By default, LocalStrategy expects to find credentials in parameters named username and password. If your site prefers to name these fields differently, options are available to change the defaults.
 */
module.exports = (localCallback) => {

    return new LocalStrategy({

        usernameField: 'email',
    }, 
    localCallback);
};
