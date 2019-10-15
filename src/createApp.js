
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');const cors = require('cors');

const funcSetup = require('./setup');

module.exports = () => {
    
    const app = express();

    // Useragent popule req.useragent
    app.use(useragent.express());

    // Display log of GET/Post in console [...]
    app.use(morgan('dev'));

    // Fill req.cookies = {...}
    app.use(cookieParser());

    // JSON Parser
    app.use(bodyParser.json());

    // Initialization of session. Allow you to get user's cookies in a 'Session' object
    funcSetup.setupSessionEnvironment(app);
    // Trust du proxy pour les cookies de session en production
    funcSetup.setupProxyEnvironment(app);

    // CORS set 'Access-Control-Allow-Origin' = client pour browser
    funcSetup.setupCORS(app);

    // PASSPORT Initialization
    funcSetup.setupPassport(app);

    // AWS (Uncomment if global AWS config is necessary)  
    // funcSetup.setupAWS(aws);

    // Server Init
    app.server = http.createServer(app);

    // Router
    funcSetup.setupRigorousRouter(app);

    return app;
};
