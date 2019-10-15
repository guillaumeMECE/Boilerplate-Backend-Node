const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');
const mongoose = require('mongoose');

const addWebsiteClientRouteController = buildRouteCallback(`${__dirname}/addWebsite`);

const mockRequest = (bodyData = {}) => ({
    body: bodyData
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
let testAccount = {};
let testWebsite = {};

describe('[Admin > Client] - AddWebsite', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('guillaumetst');
            testWebsite = await createSeed.createWebsite('guillaumeweb');
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: testWebsite._id.toString(),
                client_id: testAccount._id.toString()
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid body(website_id wrong)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: new mongoose.mongo.ObjectID().toString(),
                client_id: testAccount._id.toString()
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req with invalid body(client_id wrong)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: testWebsite._id.toString(),
                client_id: new mongoose.mongo.ObjectID().toString()
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with invalid body(website_id & client_id wrong)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: new mongoose.mongo.ObjectID().toString(),
                client_id: new mongoose.mongo.ObjectID().toString()
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with invalid body(website_id null)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: null,
                client_id: testAccount._id.toString()
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req with invalid body(client_id null)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                website_id: testWebsite._id.toString(),
                client_id: null
            });
            const res = mockResponse();

            // Act
            try {
                await addWebsiteClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
