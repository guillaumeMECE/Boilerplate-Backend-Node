// You need to import it here otherwise process.env won't have the variable in .env file
require('dotenv/config');

module.exports = {

    // API_VERSION
    API_VERSION: '1.0',

    // JWT_AUTH
    JWT_SECRET_TOKEN: process.env.APPNAME_JWT_SECRET_TOKEN,

    // FRONTEND 
    FRONTEND_URL: process.env.FRONTEND_URL,

    // BACKEND
    BACKEND_SERVER_PORT: parseInt(process.env.APPNAME_BACKEND_SERVER_PORT, 10),
    BACKEND_SERVER_HOSTNAME: parseInt(process.env.APPNAME_BACKEND_SERVER_HOSTNAME, 10),

    // Google Analytics
};
