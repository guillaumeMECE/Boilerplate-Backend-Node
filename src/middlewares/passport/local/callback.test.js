
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const callback = require('./callback');

const mockDone = () => {
    return jest.fn()
        .mockName('done');
};

// Seeds info
let testAccount = {};

describe('[Middlewares > Passport > Local] - Callback', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('callback');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'password\'', () => {
        it('should call done(null,arg2) ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await callback(testAccount.email, 'callback123123', done);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            // expect the first argument of the first call was 'null'
            expect(done.mock.calls[0][0]).toBe(null);
            expect(done.mock.calls[0][1]).not.toBe(undefined);
        });
    });

    describe('[CASE-1] req with invalid \'email\'', () => {
        it('should done with error ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await callback('wrong@email.fr', 'callback123123', done);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(done.mock.calls[0][0]).toBe(null);
            expect(done.mock.calls[0][1]).toBe(null);
        });
    });

    describe('[CASE-2] req with invalid \'password\'', () => {
        it('should done with error ', async () => {
            // Arrange
            const done = mockDone();

            // Act
            try {
                await callback(testAccount.email, 'wrongPassword', done);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            // expect the first argument of the first call was 'null'
            expect(typeof done.mock.calls[0][0]).toBe('object');
        });
    });
});
