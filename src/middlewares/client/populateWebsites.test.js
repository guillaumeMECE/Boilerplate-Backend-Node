
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const populateWebsites = require('./populateWebsites');

const mockRequest = (userIdData = undefined) => ({
    rigorous: {
        user: { id: userIdData }
    }
});

const mockRequestWithoutRigorous = () => ({});

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

describe('[Middlewares > Client] - PopulateWebsites', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('populatewebsites');
            const website = await createSeed.createWebsite();
            await createSeed.createClientWebsite(testAccount._id, website._id);
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'client_id\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).not.toBeCalled();
            expect(next).toBeCalled();
            expect(req.rigorous.websites).toBeDefined();
        });
    });

    describe('[CASE-1] req with invalid \'client_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID());
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.websites).toBeUndefined();
        });
    });

    describe('[CASE-2] req with undefined \'client_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.websites).toBeUndefined();
        });
    });

    describe('[CASE-3] req with null \'client_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(null);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.websites).toBeUndefined();
        });
    });

    describe('[CASE-4] req with boolean(true) \'client_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(true);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.websites).toBeUndefined();
        });
    });

    describe('[CASE-5] req with boolean(false) \'client_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(false);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.websites).toBeUndefined();
        });
    });

    describe('[CASE-6] req with req.rigorous undefined', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequestWithoutRigorous();
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateWebsites(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous).toBeUndefined();
        });
    });
});
