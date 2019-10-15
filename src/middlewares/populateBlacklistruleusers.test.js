
const { connectMongoose, clearDatabase, disconnectMongoose } = require('$tests/helper');
const populateBlacklistedUsers = require('./populateBlacklistruleusers');

const mockRequest = () => ({});

const mockResponse = () => ({});

const mockNext = () => {
    return jest.fn()
        .mockName('next');
};

describe('[Middlewares] - populateBlacklistruleusers', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(clearDatabase);

    afterAll(disconnectMongoose);

    describe('[CASE-0] req', () => {
        it('should next & req.blacklisted be defined ', async () => {
            // Arrange
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateBlacklistedUsers(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(req.blacklistedUsersIds).not.toBe(undefined);
            expect(next).toBeCalled();
        });
    });
});
