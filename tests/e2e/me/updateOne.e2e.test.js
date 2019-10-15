const request = require('supertest');

const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = () => `/v${API_VERSION}/bo/me`;

// Seeds info
let testAccount = {};
let testAccountNotAdmin = {};

describe(routePath(), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('guillaume', 'admin');
            testAccountNotAdmin = await createSeed.createClient();
        } catch (error) {
            console.log('x1', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);


    describe('[CASE-0] - no token send ', () => {
        it('should return 401 ', async (done) => {
            // Arrange 
            request(app)
                .put(routePath())
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('[CASE-1] - random token send ', () => {
        it('should return 401 ', async (done) => {
            // Arrange 
            request(app)
                .put(routePath())
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${Math.random().toString(36).substring(2, 15)}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });
});
