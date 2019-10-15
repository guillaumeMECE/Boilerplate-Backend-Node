const cors = require('cors');
const cookieSession = require('cookie-session');

const passport = require('passport');

const { localStrategy, jwtStrategy } = require('$core/index');

const { CustomError } = require('$core/index');
const { rigorousRouter } = require('$core/index');
const { moduleMongoose } = require('$core/index');

const { EnvironmentError } = require('$root/etc/errorsMessages');

const appConfig = require('./config');

const jwtCallback = require('./middlewares/passport/jwt/callback');
const localCallback = require('./middlewares/passport/local/callback');
const serialization = require('./middlewares/passport/serialization');

function setupSessionEnvironment(app) {
    const cookieTTLOnClient = 1000 * 60 * 60; // Ici une session dure 1h = 1000ms * 60 * 60

    let sess;

    switch (process.env.NODE_ENV) {
    case 'development':
        sess = { keys: [process.env.APPNAME_SESSION_SECRET], maxAge: cookieTTLOnClient, secure: false, httpOnly: true };
        break;
    case 'staging':
        sess = { keys: [process.env.APPNAME_SESSION_SECRET], maxAge: cookieTTLOnClient, secure: true, httpOnly: true };
        break;
    case 'production':
        sess = { keys: [process.env.APPNAME_SESSION_SECRET], maxAge: cookieTTLOnClient, secure: true, httpOnly: true };
        break;
    case 'test':
        sess = { keys: [process.env.APPNAME_SESSION_SECRET], maxAge: cookieTTLOnClient, secure: false, httpOnly: true };
        break;
    default:
        throw new CustomError(EnvironmentError);
    }

    app.use(cookieSession(sess));
}

function setupProxyEnvironment(app) {
    switch (process.env.NODE_ENV) {
    case 'production':
        app.set('trust proxy', 1); // trust first proxy
        break;
    default:
        break;
    }
}


function setupCORS(app) {
    const corsOptions = {

        origin: appConfig.FRONTEND_URL,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    };

    app.use(cors(corsOptions));
}

function setupPassport(app) {
    // SerializeUser is used to provide some identifying token that can be saved
    // in the users session.  We traditionally use the 'ID' for this.
    passport.serializeUser(serialization.serializeAuth);

    // The counterpart of 'serializeAuth'.  Given only a user's ID, we must return
    // the user object.  This object is placed on 'req.user'.
    passport.deserializeUser(serialization.deserializeAuth);

    // Instructs Passport how to authenticate a user using a locally saved email
    // and password combination.  This strategy is called whenever a user attempts to
    // log in.  We first find the user model in MongoDB that matches the submitted email,
    // then check to see if the provided password matches the saved password. There
    // are two obvious failure points here: the email might not exist in our DB or
    // the password might not match the saved one.  In either case, we call the 'done'
    // callback, including a string that messages why the authentication process failed.
    // This string is provided back to the GraphQL client.
    passport.use(localStrategy(localCallback));
    passport.use(jwtStrategy(jwtCallback, appConfig.JWT_SECRET_TOKEN));

    // Passport is wired into express as a middleware. When a request comes in,
    // Passport will examine the request's session (as set by the above config) and
    // assign the current user to the 'req.user' object.  See also servces/auth.js
    app.use(passport.initialize());
    app.use(passport.session());
}

async function setupMongoose() {
    let host;
    const port = process.env.APPNAME_DB.indexOf('+srv') > -1 ? '' : `:${process.env.APPNAME_DB_PORT}`;

    if (process.env.APPNAME_DB_HOST === 'localhost' || process.env.APPNAME_DB_HOST === '127.0.0.1') {

        host = `${process.env.APPNAME_DB_HOST}${port}`;
    } else {

        host = `${process.env.APPNAME_DB_USER}:${process.env.APPNAME_DB_PASSWORD}@${process.env.APPNAME_DB_HOST}${port}`;
    }

    const mongoDBUrl = `${process.env.APPNAME_DB}://${host}/${process.env.APPNAME_DB_DATABASE}`;

    const resConnection = await moduleMongoose.connectMongoose(mongoDBUrl);

    return resConnection;
    // Do not reload otherwise you will redefine it and you will get error on production package
    // moduleMongoose.loadModels(`${__dirname}/models`);
}
function setupRigorousRouter(app) {
    rigorousRouter.init(app, appConfig.API_VERSION, `${__dirname}/routes`);

    const router = rigorousRouter.getRouter();

    app.use(router);
}
module.exports = {
    setupSessionEnvironment: app => setupSessionEnvironment(app),
    setupProxyEnvironment: app => setupProxyEnvironment(app),
    setupPassport: app => setupPassport(app),
    setupCORS: app => setupCORS(app),
    setupMongoose: async () => setupMongoose(),
    setupRigorousRouter: app => setupRigorousRouter(app),
};
