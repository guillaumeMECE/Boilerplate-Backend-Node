const MongodbMemoryServer = require('mongodb-memory-server');
const NodeEnvironment = require('jest-environment-node');

class MongoDbEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.mongod = new MongodbMemoryServer.default({
            instance: {
                // dbName null, random name
                dbName: null,
            },
            binary: {
                version: '4.0.0',
            },
            // debug: true,
            autoStart: false,
        });
    }

    async setup() {
        await super.setup();
        await this.mongod.start();
        this.global.__MONGO_URI__ = await this.mongod.getConnectionString();
        this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName();
        this.global.__COUNTERS__ = {
            user: 0,
        };
    }

    async teardown() {
        await super.teardown();
        await this.mongod.stop();
        this.mongod = null;
        this.global = {};
    }
}

module.exports = MongoDbEnvironment;
