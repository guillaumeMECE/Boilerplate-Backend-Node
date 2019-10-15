
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const buildRouteCallback = require('$core/router/buildRouteCallback');

const articleCategoriesRouteController = buildRouteCallback(`${__dirname}/articleCategories`);

const mockRequest = (timezoneData = '', periodStart = '', periodEnd = '') => ({
    header: function (param) { return this.headers.Timezone; },
    headers: { Timezone: timezoneData },
    query: { start: periodStart, end: periodEnd },
    blacklistedarticleCategories: [],
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

describe('[Switlish > Metrics] - articleCategories', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(clearDatabase);

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid header', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testRequest.timezone, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid timezone (\'\')', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest('', testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req with invalid timezone (null)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(null, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with invalid timezone (undefined)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(undefined, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with invalid timezone (true)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(true, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req with invalid timezone (false)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(false, testRequest.start, testRequest.end);
            const res = mockResponse();

            // Act
            try {
                await articleCategoriesRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
