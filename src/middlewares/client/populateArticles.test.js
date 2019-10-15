
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const populateArticles = require('./populateArticles');

const mockRequest = (websitesIdData = undefined) => ({
    rigorous: {
        websites: websitesIdData
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
let testWebsite = {};

describe('[Middlewares > Client] - PopulateArticles', () => {
    // Seeds

    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testWebsite = await createSeed.createWebsite();
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'website_id\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testWebsite._id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).not.toBeCalled();
            expect(next).toBeCalled();
            expect(req.rigorous.articles).toBeDefined();
        });
    });

    describe('[CASE-1] req with invalid \'website_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID());
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.articles).toBeUndefined();
        });
    });

    describe('[CASE-2] req with undefined \'website_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.articles).toBeUndefined();
        });
    });

    describe('[CASE-3] req with null \'website_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(null);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.articles).toBeUndefined();
        });
    });

    describe('[CASE-4] req with boolean(true) \'website_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(true);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.articles).toBeUndefined();
        });
    });

    describe('[CASE-5] req with boolean(false) \'website_id\'', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequest(false);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(next).not.toBeCalled();
            expect(req.rigorous.articles).toBeUndefined();
        });
    });

    describe('[CASE-6] req with req.rigorous.websites undefined', () => {
        it('should return status(500)', async () => {
            // Arrange
            const req = mockRequestWithoutRigorous();
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await populateArticles(req, res, next);
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
