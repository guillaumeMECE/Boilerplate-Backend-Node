
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const { serializeAuth, deserializeAuth } = require('./serialization');

const mockAuth = (authID = '') => ({
    id: authID
});

const mockDone = () => {
    return jest.fn()
        .mockName('done');
};

// Seeds info
let testAccount = {};

describe('[Middlewares > Passport] - Serialization', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('serialization');
            const website = await createSeed.createWebsite();
            await createSeed.createClientWebsite(testAccount._id, website._id);
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] call serializeAuth', () => {
        it('should done(null,auth.id) ', async () => {
            // Arrange
            const auth = mockAuth('authID');
            const done = mockDone();

            // Act
            try {
                await serializeAuth(auth, done);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(done).toBeCalled();
            expect(done.mock.calls[0][0]).toBe(null);
            expect(done.mock.calls[0][1]).toBe('authID');
        });
    });

    describe('[CASE-1] call deserializeAuth with valid id', () => {
        it('should done(null,auth) ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await deserializeAuth(testAccount._id, done);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(done).toBeCalled();
            expect(done.mock.calls[0][0]).toBe(null);
            expect(typeof done.mock.calls[0][1]).toBe('object');
        });
    });

    describe('[CASE-2] call deserializeAuth with invalid id', () => {
        it('should done(err,null) ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await deserializeAuth(new mongoose.mongo.ObjectID(), done);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(done).toBeCalled();
            expect(typeof done.mock.calls[0][0]).toBe('object');
            expect(done.mock.calls[0][1]).toBe(null);
        });
    });

    describe('[CASE-3] call deserializeAuth with invalid id(null)', () => {
        it('should done(err,null) ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await deserializeAuth(null, done);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(done).toBeCalled();
            expect(typeof done.mock.calls[0][0]).toBe('object');
            expect(done.mock.calls[0][1]).toBe(null);
        });
    });
});
