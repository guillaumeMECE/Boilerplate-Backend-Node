const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, findOne, createSeed } = require('$tests/helper');

const updateOneWebsiteRouteController = buildRouteCallback(`${__dirname}/updateOne`);

const mockRequest = (_id = '', _body = {}) => ({
    body: _body,
    params: { id: _id }
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
let testWebsite = {};

describe('[Admin > Website] - updateOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testWebsite = await createSeed.createWebsite();
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testWebsite._id.toString(), {
                ga_view_id: testWebsite.ga_view_id,
                imageRaw: testWebsite.imageRaw,
            });
            const res = mockResponse();

            // Act
            try {
                await updateOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with valid body(change ga_view_id)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testWebsite._id.toString(), {
                ga_view_id: 'changehere',
                imageRaw: testWebsite.imageRaw,
            });
            const res = mockResponse();

            let resultsWebsite;

            // Act
            try {
                await updateOneWebsiteRouteController(req, res);
                resultsWebsite = await findOne('Website', { _id: testWebsite._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsWebsite.ga_view_id).toBe('changehere');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-2] req with valid body(change imageRaw)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testWebsite._id.toString(), {
                ga_view_id: testWebsite.ga_view_id,
                imageRaw: 'changehere',
            });
            const res = mockResponse();

            // Act
            try {
                await updateOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-3] req without body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testWebsite._id.toString());
            const res = mockResponse();

            // Act
            try {
                await updateOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-3] req without body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testWebsite._id.toString(), {
                ga_view_id: null,
                imageRaw: testWebsite.imageRaw,
            });
            const res = mockResponse();

            let resultsWebsite;

            // Act
            try {
                await updateOneWebsiteRouteController(req, res);
                resultsWebsite = await findOne('Website', { _id: testWebsite._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsWebsite.ga_view_id).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
