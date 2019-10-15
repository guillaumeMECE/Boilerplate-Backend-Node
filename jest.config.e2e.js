const config = require('./jest.config');

config.displayName = 'e2e';
// config.testPathIgnorePatterns = [
//     './tests/admin',
//     './tests/Auth',
//     './tests/dashboard',
//     './tests/me',
//     './tests/switlish',
//     './src',
// ];
config.testRegex = 'tests/e2e/.*\\.(js|jsx)$';
config.collectCoverage = false;

module.exports = config;
