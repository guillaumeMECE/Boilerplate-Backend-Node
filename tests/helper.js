
const mongoose = require('mongoose');

const _createSeed = require('./createSeed');

export const createSeed = _createSeed;

// ensure the NODE_ENV is set to 'test'
process.env.NODE_ENV = 'test';

const mongooseOptions = {
    autoIndex: false,
    autoReconnect: false,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
};

// Debug Mode
// mongoose.set('debug', true);

export async function connectMongoose() {
    jest.setTimeout(20000);
    return mongoose.connect(
        global.__MONGO_URI__,
        {
            ...mongooseOptions,
            dbName: global.__MONGO_DB_NAME__,
        },
    );
}

export async function clearDatabase() {
    await mongoose.connection.db.dropDatabase();
}

export async function disconnectMongoose() {
    await mongoose.disconnect();
    mongoose.connections.forEach((connection) => {
        const modelNames = Object.keys(connection.models);

        modelNames.forEach((modelName) => {
            delete connection.models[modelName];
        });

        const collectionNames = Object.keys(connection.collections);
        collectionNames.forEach((collectionName) => {
            delete connection.collections[collectionName];
        });
    });

    const modelSchemaNames = Object.keys(mongoose.modelSchemas);
    modelSchemaNames.forEach((modelSchemaName) => {
        delete mongoose.modelSchemas[modelSchemaName];
    });
}

export async function findOne(modelName, query = {}) {
    return mongoose
        .model(modelName)
        .findOne(query)
        .exec();
}

export async function findAll(modelName) {
    return mongoose
        .model(modelName)
        .find({})
        .exec();
}
