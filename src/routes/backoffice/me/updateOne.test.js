const mongoose = require('mongoose');

const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const buildRouteCallback = require('$core/router/buildRouteCallback');

const updateOneRouteController = buildRouteCallback(`${__dirname}/updateOne`);

const mockRequest = (idData = '', passwordData = '') => ({
    rigorous: { user: { id: idData } },
    body: { password: passwordData }
});

const mockRequestWithoutUserId = (passwordData = '') => ({
    rigorous: {},
    body: { password: passwordData }
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

describe('[Me] - updateOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('updateone');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid user_id && password', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
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
            const req = mockRequest(new mongoose.mongo.ObjectID(), 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req without user_id && password ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest();
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
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
            const req = mockRequest(null, 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
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
            const req = mockRequest(undefined, 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
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
            const req = mockRequest(true, 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
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
            const req = mockRequest(false, 'Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req without password ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id);
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-8] req with null password ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, null);
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-9] req with undefined password ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id, undefined);
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-10] req without user_id', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequestWithoutUserId('Updateone123123');
            const res = mockResponse();

            // Act
            try {
                await updateOneRouteController(req, res);
            } catch (error) {
                console.log(' ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
