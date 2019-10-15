
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const buildRouteCallback = require('$core/router/buildRouteCallback');

const mostSwittedRouteController = buildRouteCallback(`${__dirname}/mostSwitted`);

const mockRequest = (timezoneData = '', periodStart = '', periodEnd = '', websiteIdData = '') => ({
    header(param) { return this.headers.Timezone; },
    headers: { Timezone: timezoneData },
    query: { start: periodStart, end: periodEnd },
    params: { websiteId: websiteIdData },
    blacklistedUsersIds: [],
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

// Seeds info
const testRequest = {
    start: '2018-07-01',
    end: '2019-07-03',
    timezone: 'Europe/Paris'
};

describe('[Dashboard > Rankings] - mostSwitted', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            const websiteWithoutArticle = await createSeed.createWebsiteWithoutArticle();
            testRequest.websiteWithoutArticle_id = websiteWithoutArticle._id;

            const website = await createSeed.createWebsite();
            testRequest.website_id = website._id;
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid website_id', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.website_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid website_id', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID());
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req without website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
    describe('[CASE-3] req with null website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, null);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with undefined website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, undefined);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req with boolean(true) website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, true);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-6] req with boolean(false) website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, false);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req with boolean(false) website_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, false);
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-8] req with null Timezone ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(null, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.website_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-9] req with undefined Timezone ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(undefined, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.website_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-10] req with Boolean(true) Timezone ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(true, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.website_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-11] req with Boolean(false) Timezone ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(false, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.website_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-12] req with valid website_id but without article link to the website', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end, new mongoose.mongo.ObjectID(testRequest.websiteWithoutArticle_id));
            const res = mockResponse();

            // Act
            try {
                await mostSwittedRouteController(req, res);
            } catch (error) {
                console.log('error message :', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
