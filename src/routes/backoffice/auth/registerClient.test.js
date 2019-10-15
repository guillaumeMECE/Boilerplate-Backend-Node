
const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, findOne, disconnectMongoose } = require('$tests/helper');

const registerRouteController = buildRouteCallback(`${__dirname}/registerClient`);

const mockRequest = (bodyData = {}) => ({
    body: bodyData
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
const testAccount = {
    email: 'auth@registerclient.fr',
    password: 'authregisterclient123123',
    firstname: 'AuthRegisterClient',
    lastname: 'AuthRegisterClient'
};


describe('[Auth] - RegisterClient', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(clearDatabase);

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid email and password', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email,
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with an email already use ', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email,
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 2),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 2),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                // register two users for email test
                await registerRouteController({
                    email: testAccount.email,
                    firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                    lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                    password: testAccount.password
                }, res);
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status.mock.calls.length).toBe(2);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-2] req with invalid password', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(2),
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 2),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 2),
                password: testAccount.password.substr(0, 5)
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-3] req with null email', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: null,
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-4] req without maj as first char of firstname', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(2),
                firstname: testAccount.firstname.substr(1),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-5] req without maj as first char of lastname', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(2),
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(1),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-6] req with boolean(true) email', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: true,
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req with boolean(false) email', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: false,
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-8] req without \'@\' in email', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.replace('@', ''),
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.lastname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-9] req without domain extension in email', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(0, testAccount.email.length - 3), // -3 remove '.fr'
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.firstname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-10] req with email domain in uppercase', () => {
        it('Email is registered in lowercase', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(0, 5) + testAccount.email.substr(5, testAccount.email.length - 8).toUpperCase() + testAccount.email.substr(testAccount.email.length - 3),
                firstname: testAccount.firstname.substr(0, testAccount.firstname.length - 3),
                lastname: testAccount.lastname.substr(0, testAccount.firstname.length - 3),
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {

                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            const x = await findOne('Client', { email: testAccount.email.toLowerCase() });

            // Assert
            expect(x.email).toBe(testAccount.email.toLowerCase());
            
        });
    });

    describe('[CASE-11] req with email starting with \'@\'', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(4),
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                password: testAccount.password
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-12] req with valid info and birthdate', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest({
                email: testAccount.email.substr(2),
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                password: testAccount.password,
                birthdate: new Date()
            });
            const res = mockResponse();

            // Act
            try {
                await registerRouteController(req, res);
            } catch (error) {
                console.log('error register controller : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
