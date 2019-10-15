require('dotenv/config');

const mongoose = require('mongoose');
const { connectMongoose, clearDatabase, disconnectMongoose } = require('$tests/helper');

describe('[Tests] - MongooseCheckConnection', () => {
    beforeAll(connectMongoose);

    beforeEach(clearDatabase);

    afterAll(disconnectMongoose);

    describe('Case 0: Check connection state to mongoose', () => {
        it('should be connected to mongo (1)', async () => {
            // Arrange
            const isConnected = mongoose.connection.readyState;

            // Act

            // Assert
            expect(isConnected).toBe(1);
        });
    });
});
