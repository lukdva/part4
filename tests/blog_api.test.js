const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogArray = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogArray.map(blog => blog.save())
    await Promise.all(promiseArray);
  })
test('Blogs are returned in JSON format and a correct number of blogs', async () => {
    const result = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    expect(result.body.length).toEqual(helper.initialBlogs.length)
})

test('Blog post identifiers are named id', async () => {
    const result = await api
    .get('/api/blogs')
    .expect(200)

    console.log(result.body);
    result.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    })
})

test('Blog is created with POST method', async () => {
  await api
  .post('/api/blogs')
  .send(helper.blogToAdd)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(201);

  const result = await api.get('/api/blogs');
  const titles = result.body.map(r => r.title);
  expect(result.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(helper.blogToAdd.title)

  const filter = {title: helper.blogToAdd.title};
  const toObjectOptions = {transform : (doc, ret) => { delete ret._id; delete ret.__v}};
  const processedBlogs = await helper.getBlogsInDB(filter, toObjectOptions);
  console.log(processedBlogs);
  expect(processedBlogs[0]).toEqual(helper.blogToAdd);
  
})

test('No likes prop defaults to 0', async() => {
  const result = await api
  .post('/api/blogs')
  .send(helper.blogNoLikesProp)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(201);

  expect(result.body.likes).toBeDefined();

  const filter = {title: helper.blogNoLikesProp.title};
  const processedBlogs = await helper.getBlogsInDB(filter);
  expect(processedBlogs[0].likes).toBe(0);
})

test('No URL and Title returns 400 status', async() => {
  const result = await api
  .post('/api/blogs')
  .send(helper.blogNoUrlTitle)
  .set('Accept', 'application/json')
  .expect(400);

  expect(result.body.error).toBeDefined();
  expect(result.body.error).toBe('bad request')
})

describe('Deleting blog', () => {

  test('Remove single blog', async () => {
  const blogs = await helper.getBlogsInDB();
  await api
  .delete(`/api/blogs/${blogs[0]._id}`)
  .expect(204)
  })

  test('Try to remove already removed blog', async () => {
    const nonExistantId = await helper.getNonExistantId();
    const result = await api
    .delete(`/api/blogs/${nonExistantId}`)
    .expect(404)

    expect(result.body.error).toBeDefined();
    expect(result.body.error).toBe('not found')
  })
})
afterAll(() => {
    mongoose.connection.close();
});