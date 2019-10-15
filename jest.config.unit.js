const config = require('./jest.config');

config.displayName = 'unit';
config.testPathIgnorePatterns = [
    './tests'
];
config.collectCoverage = false;

module.exports = config;
