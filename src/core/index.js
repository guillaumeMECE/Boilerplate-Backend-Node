/* eslint global-require:0 */

module.exports = {

    // Errors
    errorsMessages: require('./errors/errorsMessages'),
    CustomError: require('./errors/CustomError'),

    // Helpers
    formatChecker: require('./helpers/formatChecker'),
    formatName: require('./helpers/formatName'),
    secureInput: require('./helpers/secureInput'),

    // Middlewares
    authorizeUser: require('./middlewares/passport/jwt/middlewareUser').create,
    authorizeClient: require('./middlewares/passport/jwt/middlewareClient').create,
    localStrategy: require('./middlewares/passport/local/strategy'),
    jwtStrategy: require('./middlewares/passport/jwt/strategy'),

    // Router
    ReadOneRoute: require('./router/routes/ReadOneRoute'),
    ReadAllRoute: require('./router/routes/ReadAllRoute'),
    DeleteManyRoute: require('./router/routes/DeleteManyRoute'),
    RigorousRoute: require('./router/routes/RigorousRoute'),
    rigorousRouter: require('./router/index'),

    // Mongoose
    moduleMongoose: require('./modules/moongoose'),

    // Config
    RigorousConfig: require('./config'),
};
