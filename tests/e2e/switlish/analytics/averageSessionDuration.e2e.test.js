
const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const request = require('supertest');
const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = () => `/v${API_VERSION}/bo/switlish/analytics/average-session-duration`;

// Seeds info
let testAccount = {};
let testAccountNotAdmin = {};

describe(routePath(), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccountNotAdmin = await createSeed.createClient();
            testAccount = await createSeed.createClient('averagesessionduration', 'admin');
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] - admin token send ', () => {
        it('should return 200 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath())
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-1] - random token send ', () => {
        it('should return 401 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath())
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${Math.random().toString(36).substring(2, 15)}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('[CASE-2] - client token send ', () => {
        it('should return 200 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath())
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccountNotAdmin.token}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-3] - no timezone send', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath())
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
});
