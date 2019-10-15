const config = require('./jest.config');

config.testPathIgnorePatterns = [
    './dist',
];
config.collectCoverageFrom = ['src/**'];
module.exports = config;
