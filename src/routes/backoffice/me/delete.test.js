const mongoose = require('mongoose');

const { connectMongoose, clearDatabase, disconnectMongoose, findOne, findAll, createSeed } = require('$tests/helper');

const buildRouteCallback = require('$core/router/buildRouteCallback');

const getRouteController = buildRouteCallback(`${__dirname}/delete`);

const mockRequest = (user_id = '', auth_id = '') => ({
    rigorous: {
        user: { id: user_id },
        auth: { id: auth_id }
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

// Seeds info
let testAccount = {};

describe('[Me] - get', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('awesomegui');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid client_id & auth_id', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount.id, testAccount.auth_id);
            const res = mockResponse();

            let resultsClient;
            let resultsAuth;
            // Act
            try {
                await getRouteController(req, res);
                resultsClient = await findOne('Client', { _id: testAccount.id });
                resultsAuth = await findOne('Auth', { _id: testAccount.auth_id });
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsClient).toBe(null);
            expect(resultsAuth).toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid auth_id & valid client_id', () => {
        it('should return status(500) & not remove client', async () => {
            // Arrange
            const req = mockRequest(testAccount.id, new mongoose.mongo.ObjectID());
            const res = mockResponse();

            let client;
            let auth;
            
            // Act
            try {
                await getRouteController(req, res);
                client = await findOne('Client', { _id: testAccount.id });
                auth = await findOne('Auth', { email: client.email });
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(client).not.toBe(null);
            expect(auth).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req with invalid client_id & valid auth_id', () => {
        it('should return status(500) & not remove auth', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(), testAccount.auth_id);
            const res = mockResponse();

            let resultsClient;
            let resultsAuth;
            // Act
            try {
                await getRouteController(req, res);
                resultsClient = await findAll('Client');
                resultsAuth = await findOne('Auth', { _id: testAccount.auth_id });
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsClient).not.toBe(null);
            expect(resultsAuth).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with invalid client_id & auth_id', () => {
        it('should return status(500) & not remove any auth & client', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(), new mongoose.mongo.ObjectID());
            const res = mockResponse();

            let resultsClient;
            let resultsAuth;
            // Act
            try {
                await getRouteController(req, res);
                resultsClient = await findAll('Client');
                resultsAuth = await findAll('Auth');
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsClient).not.toBe(null);
            expect(resultsAuth).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
