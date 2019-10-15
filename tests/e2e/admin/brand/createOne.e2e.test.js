const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const request = require('supertest');
const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = () => `/v${API_VERSION}/bo/admin/brands`;

// Seeds info
let testAccount = {};
let testAccountNotAdmin = {};

describe(routePath(), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccount = await createSeed.createClient('adminguill', 'admin');
            testAccountNotAdmin = await createSeed.createClient();
            await createSeed.createBrand('brandtest');
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
                .post(routePath())
                .send({ name: 'guibrand' })
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-1] - client token send ', () => {
        it('should return 401 ', async (done) => {
            // Arrange 
            request(app)
                .post(routePath())
                .send({ name: 'guibrand' })
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccountNotAdmin.token}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('[CASE-2] - no token send ', () => {
        it('should return 401 ', async (done) => {
            // Arrange 
            request(app)
                .post(routePath())
                .send({ name: 'guibrand' })
                // Act
                .set('Accept', 'application/json')
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('[CASE-3] - random token send ', () => {
        it('should return 401 ', async (done) => {
            // Arrange 
            request(app)
                .post(routePath())
                .send({ name: 'guibrand' })
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${Math.random().toString(36).substring(2, 15)}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });
});
