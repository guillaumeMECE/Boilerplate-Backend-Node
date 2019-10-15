// You need to import it here otherwise process.env won't have the variable in .env file
require('dotenv/config');

module.exports = {

    // API_VERSION
    API_VERSION: '2.0',
	
    // JWT_AUTH
    JWT_SECRET_TOKEN: process.env.APPNAME_JWT_SECRET_TOKEN,

    // FRONTEND 
    FRONTEND_URL: process.env.FRONTEND_URL,

    // BACKEND
    BACKEND_SERVER_PORT: parseInt(process.env.APPNAME_BACKEND_SERVER_PORT, 10),  
    BACKEND_SERVER_HOSTNAME: parseInt(process.env.APPNAME_BACKEND_SERVER_HOSTNAME, 10),

    // PAGINATION
    PAGINATION_INITIAL_ID: '111111111111111111111111', // works because 4-byte value representing the seconds since the Unix epoch
    PAGINATION_LAST_ID: 'ffffffffffffffffffffffff', // works because 4-byte value representing the seconds since the Unix epoch
    
    // Google Analytics
    ANALYTICS_VIEW_ID: process.env.ANALYTICS_VIEW_ID,
};
