const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

  beforeEach(async () => {
    await User.deleteMany({});
    // const userArray = helper.initialUsers.map(user => new User(user))
    // const promiseArray = userArray.map(user => user.save())
    // await Promise.all(promiseArray);
  })

  describe("Invalid user creations", () => {
    test("Create user with no password", async () => {
        const result = await api
        .post('/api/users')
        .send(helper.userNoPassword)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(result.body.error).toBe('bad request - Password too short');
    })
    test("Create user with short password", async () => {
        const result = await api
        .post('/api/users')
        .send(helper.userShortPassword)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(result.body.error).toBe('bad request - Password too short');
    })
    test("Create user with no username", async () => {
        const result = await api
        .post('/api/users')
        .send(helper.userNoUsername)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(result.body.error).toContain('Username not provided');
    })
    test("Create user with short username", async () => {
        const result = await api
        .post('/api/users')
        .send(helper.userShortUsername)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(result.body.error).toContain('Username too short');
    })
  })

afterAll(() => {
    mongoose.connection.close();
});