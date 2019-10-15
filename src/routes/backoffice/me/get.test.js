
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const buildRouteCallback = require('$core/router/buildRouteCallback');

const getRouteController = buildRouteCallback(`${__dirname}/get`);

const mockRequest = (idData = '') => ({
    rigorous: { user: { id: idData } } // req.rigorous.user.id
});

const mockRequestWithoutUser = () => ({
    rigorous: null
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
            testAccount = await createSeed.createClient('backofficemeget');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid user_id', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id);
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with invalid user_id', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID());
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req without user_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest();
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
    describe('[CASE-3] req with null user_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(null);
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with undefined user_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(undefined);
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req with boolean(true) user_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(true);
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-6] req with boolean(false) user_id ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(false);
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req without req.rigorous.user.id', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequestWithoutUser();
            const res = mockResponse();

            // Act
            try {
                await getRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
