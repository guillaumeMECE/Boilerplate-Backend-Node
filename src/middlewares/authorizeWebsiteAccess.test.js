
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const authorizeWebsiteAccess = require('./authorizeWebsiteAccess');

const mockRequest = (userIdData = '', websiteIdData = '') => ({
    rigorous: { user: { id: userIdData } },
    params: { websiteId: websiteIdData }
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
let testWebsite = {};

describe('[Middlewares] - AuthorizeWebsiteAccess', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('authorizewebsiteaccess');

            testWebsite = await createSeed.createWebsite('websiteForUnitTest2');

            const website = await createSeed.createWebsite();
            testAccount.website_id = website.id;
            await createSeed.createClientWebsite(testAccount.id, testAccount.website_id);
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'client_id\' & \'website_id\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount.id), new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).not.toBeCalled();
            expect(next).toBeCalled();
        });
    });

    describe('[CASE-1] req with invalid \'client_id\'', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(), new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-2] req without link between \'client\' & \'website\'', () => {
        it('should return status(500) ', async () => {
            // Arrange
            // const noLinkWithClientWebsiteId = await Website.findOne({ url: testWebsite.url }, '_id').exec();
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), new mongoose.mongo.ObjectID(testWebsite._id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-3] req with invalid \'website_id\'', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), new mongoose.mongo.ObjectID());
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-4] req with invalid \'website_id\'(null)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), null);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-5] req with invalid \'website_id\'(undefined)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), undefined);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-6] req with invalid \'website_id\'(true)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), true);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-7] req with invalid \'website_id\'(false)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), false);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-8] req with invalid \'website_id\'(number)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), 14);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-9] req with invalid \'website_id\'(object)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(testAccount._id), { _id: '5d13688fedf7096c665597e7' });
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-10] req with invalid \'client_id\'(null)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(null, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-11] req with invalid \'client_id\'(undefined)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(undefined, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-12] req with invalid \'client_id\'(true)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(true, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-13] req with invalid \'client_id\'(false)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(false, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-14] req with invalid \'client_id\'(number)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(14, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-15] req with invalid \'client_id\'(object)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({ _id: '5d13688fedf7096c665597e7' }, new mongoose.mongo.ObjectID(testAccount.website_id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await authorizeWebsiteAccess(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(next).not.toBeCalled();
        });
    });
});
