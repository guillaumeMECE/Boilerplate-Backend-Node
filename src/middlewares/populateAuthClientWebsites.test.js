
const mongoose = require('mongoose');
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');
const populateAuthClientWebsites = require('./populateAuthClientWebsites');

const mockRequest = (userIdData = '') => ({
    rigorous: {
        user: {
            id: userIdData
        }
    }
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn()
        .mockReturnValue(res)
        .mockName('res.status');
    res.json = jest.fn()
        .mockReturnValue(res)
        .mockName('res.json');
    return res;
};

const mockNext = () => {
    return jest.fn()
        .mockName('next');
};

// Seeds info
let testAccount = {};

describe('[Middlewares] - PopulateAuthClientWebsites', () => {
    // Seeds

    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('populateauthclient');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'client ID\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).not.toBeCalled();
            expect(next).toBeCalled();
        });
    });

    describe('[CASE-1] req with unregister \'client ID\'', () => {
        it('should return status 500 ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID());
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-2] req with null \'client ID\'', () => {
        it('should return status 500 ', async () => {
            // Arrange
            const req = mockRequest(null);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-3] req with undefined \'client ID\'', () => {
        it('should return status 500 ', async () => {
            // Arrange
            const req = mockRequest(undefined);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-4] req with boolean(true) \'client ID\'', () => {
        it('should return status 500 ', async () => {
            // Arrange
            const req = mockRequest(true);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-5] req with boolean(false) \'client ID\'', () => {
        it('should return status 500 ', async () => {
            // Arrange
            const req = mockRequest(false);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateAuthClientWebsites(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });
});
