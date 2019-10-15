const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, findOne, findAll, createSeed } = require('$tests/helper');

const createOneRouteController = buildRouteCallback(`${__dirname}/createOne`);

const mockRequest = (_id = '', _name = '') => ({
    rigorous: { user: { id: _id } },
    body: { name: _name }
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

describe('[Admin > Brand] - createOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('guillaumetst');
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid brand name', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount.id, 'guibrand');
            const res = mockResponse();

            let resultsBrand;
            // Act
            try {
                await createOneRouteController(req, res);
                resultsBrand = await findOne('Brand', { name: 'guibrand' });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.name).toBe('guibrand');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req without brand name', () => {
        it('should not create brand ', async () => {
            // Arrange
            const req = mockRequest(testAccount.id, ' ');
            const res = mockResponse();

            let resultsBrand;
            // Act
            try {
                await createOneRouteController(req, res);
                resultsBrand = await findAll('Brand');
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.name).not.toBe(' ');
        });
    });

    describe('[CASE-2] req with an existing brand name', () => {
        it('should not create brand ', async () => {
            // Arrange
            const req = mockRequest(testAccount.id, 'guibrand');
            const res = mockResponse();

            let resultsBrand;
            // Act
            try {
                await createSeed.createBrand('guibrand');
                await createOneRouteController(req, res);
                resultsBrand = await findAll('Brand');
                console.log('zengkjezgel ', resultsBrand);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.length).not.toBeGreaterThan(1);
        });
    });
});
