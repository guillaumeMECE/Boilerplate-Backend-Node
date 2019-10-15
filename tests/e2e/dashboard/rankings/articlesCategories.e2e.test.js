const { connectMongoose, clearDatabase, disconnectMongoose, createSeed } = require('$tests/helper');

const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('$root/createApp');
const { API_VERSION } = require('$root/config');

const app = createApp();

const routePath = param => `/v${API_VERSION}/bo/dashboard/websites/${param}/rankings/articles-categories`;

// Seeds info
let testAccount = {};
let testWebsite = {};
let testAccountNotAdmin = {};

describe(routePath(''), () => {
    // Seeds
    beforeAll(connectMongoose);

    beforeEach(async () => {
        await clearDatabase();
        try {
            testAccountNotAdmin = await createSeed.createClient();
            const { client, website } = await createSeed.createClientWebsiteLink();
            testAccount = client;
            testWebsite = website;
        } catch (error) {
            console.log('', error.message);
            console.log('ERROR : ', error);
        }
    });

    afterAll(disconnectMongoose);

    describe('[CASE-0] - admin token send & valid website_id ', () => {
        it('should return 200 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath(testWebsite._id))
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('[CASE-1] - random token send & valid website_id ', () => {
        it('should return 401 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath(testWebsite._id))
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${Math.random().toString(36).substring(2, 15)}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('[CASE-2] - admin token send & invalid website_id ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath(new mongoose.mongo.ObjectID()))
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-3] - client token send & valid website_id ', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath(testWebsite._id))
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccountNotAdmin.token}`)
                .set('Timezone', 'Europe/Paris')
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });

    describe('[CASE-4] - no timezone send', () => {
        it('should return 500 ', async (done) => {
            request(app)
                // Arrange
                .get(routePath(testWebsite._id))
                // Act
                .set('Accept', 'application/json')
                .set('Authorization', `bearer ${testAccount.token}`)
                // Assert
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
});
