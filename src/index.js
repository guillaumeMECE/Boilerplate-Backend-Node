
require('module-alias/register');

require('@babel/register');
require('@babel/polyfill');

const funcSetup = require('./setup');
const appConfig = require('./config');
const createApp = require('./createApp');

const app = createApp();

// Mongoose connection to Mongo DB
funcSetup.setupMongoose()
    .then((result) => {
        console.log('MONGOOSE connection ok');
    })
    .catch((err) => {
        console.log('MONGOOSE failed ', err);        
    });


// LISTEN PORT
app.server.listen(appConfig.BACKEND_SERVER_PORT, appConfig.BACKEND_SERVER_HOSTNAME, () => {
    console.log('App is running on address', app.server.address());
    console.log(`App is running on port ${app.server.address().port}`);

});

export default app;
