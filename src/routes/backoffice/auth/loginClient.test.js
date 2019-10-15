
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const buildRouteCallback = require('$core/router/buildRouteCallback');
const { Auth } = require('$models');

const mockAuthLogin = jest.spyOn(Auth, 'login').mockName('AuthLogin');

const loginRouteController = buildRouteCallback(`${__dirname}/loginClient`);

const mockRequest = (_body = {}) => ({
    body: _body
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

describe('[Auth] - LoginClient', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('authloginclient');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid email and password', () => {
        it('should return \'validToken\' & status(200) ', async () => {
            // Arrange
            console.log('typeof email', typeof testAccount.email);
            console.log('typeof password', testAccount.password);

            const req = mockRequest({ email: testAccount.email, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin).toBeCalled();
            expect(mockAuthLogin).toBeCalledWith(testAccount.email, testAccount.password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: { token: 'validToken' } });
        });
    });

    describe('[CASE-1] passport return a null token (AuthService.login)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue(null);

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin).toBeCalled();
            expect(mockAuthLogin).toBeCalledWith(testAccount.email, testAccount.password);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] passport return an undefined token (AuthService.login)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue(undefined);

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin).toBeCalled();
            expect(mockAuthLogin).toBeCalledWith(testAccount.email, testAccount.password);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with invalid email', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: 'invalid'.concat(testAccount.email), password: testAccount.password });
            const res = mockResponse();

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin).toBeCalled();
            expect(mockAuthLogin).toBeCalledWith('invalid'.concat(testAccount.email), testAccount.password);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req with invalid password', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: 'invalid'.concat(testAccount.password) });
            const res = mockResponse();

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin).toBeCalled();
            expect(mockAuthLogin).toBeCalledWith(testAccount.email, 'invalid'.concat(testAccount.password));
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req with null email', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: null, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-6] req with null password', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: null });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req with undefined email', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: undefined, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-8] req with undefined password', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: undefined });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-9] req with boolean email (true)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: true, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-10] req with boolean password (true)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: true });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-11] req with boolean email (false)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: false, password: testAccount.password });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-12] req with boolean password (false)', () => {
        it('should return an error & status 500', async () => {
            // Arrange
            const req = mockRequest({ email: testAccount.email, password: false });
            const res = mockResponse();
            mockAuthLogin.mockReturnValue('validToken');

            // Act
            try {
                await loginRouteController(req, res);
            } catch (error) {
                console.log('error login controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(mockAuthLogin.mock.calls.length).toEqual(0);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
