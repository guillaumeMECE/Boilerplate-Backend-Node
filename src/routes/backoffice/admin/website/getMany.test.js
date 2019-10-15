const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const getManyWebsiteRouteController = buildRouteCallback(`${__dirname}/getMany`);

const mockRequest = (idData = null, queryData = {}) => ({
    rigorous: { user: { id: idData } },
    query: queryData
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

describe('[Admin > Website] - GetMany', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            const { client } = await createSeed.createClientWebsiteLink();
            testAccount = client;
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, {
                reverse: true,
                lastPaginatedId: null,
                value: null
            });
            const res = mockResponse();

            // Act
            try {
                await getManyWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with valid body(all null)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, {
                reverse: null,
                lastPaginatedId: null,
                value: null
            });
            const res = mockResponse();

            // Act
            try {
                await getManyWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-2] req without body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id);
            const res = mockResponse();

            // Act
            try {
                await getManyWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-3] req with query undefined', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id);
            delete req.query;
            const res = mockResponse();

            // Act
            try {
                await getManyWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
