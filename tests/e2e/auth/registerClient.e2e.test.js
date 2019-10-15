const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const request = require('supertest');
const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = () => `/v${API_VERSION}/bo/auth/register`;

// Seeds info
let testAccountCopy = {};
const testAccount = {
    email: 'test@account.fr',
    password: 'testaccount123123',
    firstname: 'TestAccount',
    lastname: 'TestAccount',
    birthdate: new Date(),
};

describe(routePath(), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccountCopy = await createSeed.createClient('authregister');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] - valid Account ', () => {
        it('should return 200 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send(testAccount)
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-1] - copy Account ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send(testAccountCopy)
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-2] - Account without birthday ', () => {
        it('should return 200 ', async (done) => {
            // Arrange
            const newTestAccount = Object.assign({}, testAccount);
            delete newTestAccount.birthday;
            request(app)
                .post(routePath())
                .send(newTestAccount)
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-3] - Account without uppercase for firstname ', () => {
        it('should return 500 ', async (done) => {
            // Arrange
            const newTestAccount = Object.assign({}, testAccount);
            newTestAccount.firstname = newTestAccount.firstname.substr(1);
            request(app)
                .post(routePath())
                .send(newTestAccount)
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-4] - Account without password ', () => {
        it('should return 500 ', async (done) => {
            // Arrange
            const newTestAccount = Object.assign({}, testAccount);
            delete newTestAccount.password;
            request(app)
                .post(routePath())
                .send(newTestAccount)
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
});
