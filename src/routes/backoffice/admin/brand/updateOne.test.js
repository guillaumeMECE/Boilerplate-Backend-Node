const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, findOne, createSeed } = require('$tests/helper');

const updateOneRouteController = buildRouteCallback(`${__dirname}/updateOne`);

const mockRequest = (_id = '', _name = '') => ({
    params: { id: _id },
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
let testBrand = {};

describe('[Admin > Brand] - updateOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testBrand = await createSeed.createBrand();
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req without change', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testBrand._id.toString(), testBrand.name);
            const res = mockResponse();

            let resultsBrand;

            // Act
            try {
                await updateOneRouteController(req, res);
                resultsBrand = await findOne('Brand', { _id: testBrand._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.name).toBe(testBrand.name);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with valid brand name', () => {
        it('should change brand name to the new one', async () => {
            // Arrange
            const req = mockRequest(testBrand._id.toString(), 'newbrandname');
            const res = mockResponse();

            let resultsBrand;

            // Act
            try {
                await updateOneRouteController(req, res);
                resultsBrand = await findOne('Brand', { _id: testBrand._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.name).toBe('newbrandname');
        });
    });

    describe('[CASE-2] req with brand name that already exist', () => {
        it('should change brand name to the new one', async () => {
            // Arrange
            const req = mockRequest(testBrand._id.toString(), 'copybrand');
            const res = mockResponse();

            let resultsBrand;

            // Act
            try {
                await createSeed.createBrand('copybrand');
                await updateOneRouteController(req, res);
                resultsBrand = await findOne('Brand', { _id: testBrand._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsBrand.name).not.toBe('copybrand');
        });
    });
});
