const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const getWebsitesClientRouteController = buildRouteCallback(`${__dirname}/getWebsites`);

const mockRequest = (_clientID = '') => ({
    // req.rigorous.user.id
    rigorous: { user: { id: _clientID } },
    query: {
        reverse: true,
        lastPaginatedId: '',
        value: '',
    },
    params: { client_id: _clientID }
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

describe('[Admin > Client] - getWebsites', () => {
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
            const req = mockRequest(testAccount.id.toString());
            const res = mockResponse();

            // Act
            try {
                await getWebsitesClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
