
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const IsClientAdmin = require('./isClientAdmin');

const mockRequest = (userIdData = {}) => ({
    rigorous: { user: { id: userIdData } }
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

const mockNext = () => {
    return jest.fn()
        .mockName('next');
};

// Seeds info
let adminTestAccount = {};
let clientTestAccount = {};

describe('[Middlewares] - IsClientAdmin', () => {
    // Seeds

    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            adminTestAccount = await createSeed.createClient('adminisclientadmin', 'admin');

            clientTestAccount = await createSeed.createClient('clientisclientadmin');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid \'adminAccount\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(adminTestAccount._id));
            const res = mockResponse();
            const next = mockNext();

            console.log('###################HERE :', adminTestAccount);


            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).not.toBeCalled();
            expect(next).toBeCalled();
        });
    });

    describe('[CASE-1] req with invalid \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID(clientTestAccount._id));
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-2] req with unregister \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(new mongoose.mongo.ObjectID());
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-3] req with null \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(null);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-4] req with undefined \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(undefined);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-5] req with boolean(true) \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(true);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });

    describe('[CASE-6] req with boolean(false) \'Account\'', () => {
        it('should next ', async () => {
            // Arrange
            const req = mockRequest(false);
            const res = mockResponse();
            const next = mockNext();

            // Act
            try {
                await IsClientAdmin(req, res, next);
            } catch (error) {
                console.log('error : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toBeCalled();
            expect(res.status).toBeCalledWith(401);
            expect(next).not.toBeCalled();
        });
    });
});
