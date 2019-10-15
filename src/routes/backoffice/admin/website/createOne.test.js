const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const createOneWebsiteRouteController = buildRouteCallback(`${__dirname}/createOne`);

const mockRequest = (IdData = null, nameData = null, urlData = null) => ({
    rigorous: { user: { id: IdData } },
    body: {
        name: nameData,
        url: urlData,
        ga_view_id: 'NA'
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

describe('[Admin > Website] - CreateOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('guillaume', 'admin');
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid name and url', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, 'fnactst', 'fnactst.fr');
            const res = mockResponse();

            // Act
            try {
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid url (without domain)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, 'fnactst', 'fnactstfr');
            const res = mockResponse();

            // Act
            try {
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req with null name', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, null, 'fnactst.fr');
            const res = mockResponse();

            // Act
            try {
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with null url', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, 'fnactst', null);
            const res = mockResponse();

            // Act
            try {
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with null name & url', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id);
            const res = mockResponse();

            // Act
            try {
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req copy existing website', () => {
        it('should return status(500) ', async () => {

            const websiteName = 'fnactst';

            // Arrange
            const req = mockRequest(testAccount._id, websiteName, 'fnactst.fr');
            const res = mockResponse();

            // Act
            try {
                await createSeed.createWebsite(websiteName);
                await createOneWebsiteRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
