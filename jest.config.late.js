const config = require('./jest.config');

config.testPathIgnorePatterns = [
    './src',
];
config.collectCoverageFrom = ['dist/**/*.js', '!dist/**/*.js.map', '!dist/**/*.test.js'];
module.exports = config;
