const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, findOne, createSeed } = require('$tests/helper');

const removeWebsitesRouteController = buildRouteCallback(`${__dirname}/removeWebsites`);

const mockRequest = (idData = '', _ids = []) => ({
    params: { client_id: idData },
    body: {
        ids: _ids
    },
    rigorous: { user: { id: idData } }
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
let testWebsite0 = {};
let testWebsite1 = {};

describe('[Admin > Client] - RemoveWebsites', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            const { client, website } = await createSeed.createClientWebsiteLink();
            testAccount = client;
            testWebsite0 = website;
            testWebsite1 = await createSeed.createWebsiteWithoutArticle('guitest');
            await createSeed.createClientWebsite(testAccount.id, testWebsite1.id);
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount.id.toString(), [testWebsite0.id.toString()]);
            const res = mockResponse();

            let resultsWebsite0;
            let resultsWebsite1;

            // Act
            try {
                await removeWebsitesRouteController(req, res);
                resultsWebsite0 = await findOne('ClientWebsite', { website_id: testWebsite0.id });
                resultsWebsite1 = await findOne('ClientWebsite', { website_id: testWebsite1.id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsWebsite0).toBe(null);
            expect(resultsWebsite1).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with valid body', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), [
                testWebsite1._id.toString(),
                testWebsite0._id.toString()
            ]);
            const res = mockResponse();

            let resultsWebsite0;
            let resultsWebsite1;

            // Act
            try {
                await removeWebsitesRouteController(req, res);
                resultsWebsite0 = await findOne('ClientWebsite', { website_id: testWebsite0._id });
                resultsWebsite1 = await findOne('ClientWebsite', { website_id: testWebsite1._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsWebsite0).toBe(null);
            expect(resultsWebsite1).toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-2] req without website_ids to remove', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString());
            const res = mockResponse();

            let resultsWebsite0;
            let resultsWebsite1;

            // Act
            try {
                await removeWebsitesRouteController(req, res);
                resultsWebsite0 = await findOne('ClientWebsite', { website_id: testWebsite0._id });
                resultsWebsite1 = await findOne('ClientWebsite', { website_id: testWebsite1._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsWebsite0).not.toBe(null);
            expect(resultsWebsite1).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
