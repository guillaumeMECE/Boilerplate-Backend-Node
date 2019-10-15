const buildRouteCallback = require('$core/router/buildRouteCallback');
const { connectMongoose, clearDatabase, disconnectMongoose, findOne, createSeed } = require('$tests/helper');

const updateOneClientRouteController = buildRouteCallback(`${__dirname}/updateOne`);

const mockRequest = (clientID = '', bodyData = {}) => ({
    body: bodyData,
    params: { client_id: clientID }
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

describe('[Admin > Client] - UpdateOne', () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('guillaumetst');
        } catch (error) {
            console.log('ERROR MESSAGE :', error.message);
            console.log('ERROR :', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] req with valid body(change nothing)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            // Act
            try {
                await updateOneClientRouteController(req, res);
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-1] req with valid body(change firstname)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: 'Changehere',
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccount;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccount = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(resultsAccount.firstname).toBe('Changehere');
        });
    });

    describe('[CASE-2] req with valid body(change lastname)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: 'Changehere',
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccount;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccount = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(resultsAccount.lastname).toBe('Changehere');
        });
    });

    describe('[CASE-3] req with valid body(change email)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: 'new@email.fr',
                password: testAccount.password,
            });
            const res = mockResponse();
            let resultsAccountClient;
            let resultsAccountAuth;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
                resultsAccountAuth = await findOne('Auth', { user_id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(resultsAccountClient.email).toBe('new@email.fr');
            expect(resultsAccountAuth.email).toBe('new@email.fr');
        });
    });

    describe('[CASE-4] req with valid body(change password)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: 'newpassword',
            });
            const res = mockResponse();

            let passwordBeforeUpdate;
            let resultsAccount;

            // Act
            try {
                passwordBeforeUpdate = await findOne('Auth', { email: testAccount.email });
                await updateOneClientRouteController(req, res);
                resultsAccount = await findOne('Auth', { user_id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(resultsAccount.password).not.toBe(passwordBeforeUpdate.password);
        });
    });

    describe('[CASE-5] req with invalid body(firstname without maj)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: 'changehere',
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccount;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccount = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccount.firstname).not.toBe('changehere');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-6] req with invalid body(lastname without maj)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: 'changehere',
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccount;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccount = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccount.lastname).not.toBe('changehere');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-7] req with invalid body(email without \'@\')', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: 'newemail.fr',
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccountClient;
            let resultsAccountAuth;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
                resultsAccountAuth = await findOne('Auth', { user_id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.email).not.toBe('newemail.fr');
            expect(resultsAccountAuth.email).not.toBe('newemail.fr');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-8] req with invalid body(email without domain extension)', () => {
        it('should return status(500) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: 'new@email',
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccountClient;
            let resultsAccountAuth;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
                resultsAccountAuth = await findOne('Auth', { user_id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.email).not.toBe('new@email');
            expect(resultsAccountAuth.email).not.toBe('new@email');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('[CASE-9] req with valid body(firstname null)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: null,
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccountClient;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.firstname).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-10] req with valid body(lastname null)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: null,
                email: testAccount.email,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccountClient;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.lastname).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-11] req with valid body(email null)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: null,
                password: testAccount.password,
            });
            const res = mockResponse();

            let resultsAccountClient;
            let resultsAccountAuth;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
                resultsAccountAuth = await findOne('Auth', { user_id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.email).not.toBe(null);
            expect(resultsAccountAuth.email).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('[CASE-12] req with valid body(password null)', () => {
        it('should return status(200) ', async () => {
            // Arrange
            const req = mockRequest(testAccount._id.toString(), {
                firstname: testAccount.firstname,
                lastname: testAccount.lastname,
                email: testAccount.email,
                password: null,
            });
            const res = mockResponse();

            let resultsAccountClient;

            // Act
            try {
                await updateOneClientRouteController(req, res);
                resultsAccountClient = await findOne('Client', { _id: testAccount._id });
            } catch (error) {
                console.log('error message : ', error.message);
                console.log('ERROR : ', error);
            }

            // Assert
            expect(resultsAccountClient.password).not.toBe(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
