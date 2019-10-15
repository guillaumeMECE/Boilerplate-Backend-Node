const request = require('supertest');

const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = () => `/v${API_VERSION}/bo/auth/login`;

// Seeds info
let testAccount = {};

describe(routePath(''), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient();
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] - valid email & password ', () => {
        it('should return 200 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send({
                    email: testAccount.email,
                    password: testAccount.password
                })
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-1] - invalid email ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send({
                    email: 'invalid@email.fr',
                    password: testAccount.password
                })
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-2] - invalid password ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send({
                    email: testAccount.email,
                    password: testAccount.password.concat('invalid123')
                })
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-3] - random email and password ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .post(routePath())
                .send({
                    email: Math.random().toString(36).substring(2, 15),
                    password: Math.random().toString(36).substring(2, 15)
                })
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
});
