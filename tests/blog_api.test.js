const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

let user;
let token;
  beforeAll(async () => {
    await User.deleteMany({});
    ({user, token} = await helper.createUserAndLogin());
  })

  beforeEach(async () => {
    await Blog.deleteMany({});
    
    const blogArray = helper.initialBlogs.map(blog => new Blog({...blog, user:user.id}))
    const promiseArray = blogArray.map(blog => blog.save())
    await Promise.all(promiseArray);
  })
  describe('GET method tests', () =>{

    test('Blogs are returned in JSON format and a correct number of blogs', async () => {
      const result = await api
      .get('/api/blogs')
      .set('Authorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbnlTIiwiaWQiOiI2MmRlODIzZjZlNDk2MjgwZDI3OTkzOTEiLCJpYXQiOjE2NTg5MjE3MjJ9.MmIVAbuiAv7xe2XYfBBP9siP8L3jcTRmZ8P56-TUHOQ")
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
      expect(result.body.length).toEqual(helper.initialBlogs.length)
  })
  
  test('Blog post identifiers are named id', async () => {
      const result = await api
      .get('/api/blogs')
      .expect(200)
  
      result.body.forEach(blog => {
        expect(blog.id).toBeDefined();
      })
  })
  })

describe('POST method tests', () => {
  test('Blog is created with POST method', async () => {
    await api
    .post('/api/blogs')
    .send(helper.blogToAdd)
    .set({'Accept': 'application/json', 'Authorization': `Bearer ${token}`})
    .expect('Content-Type', /json/)
    .expect(201);
  
    const result = await api.get('/api/blogs');
    const titles = result.body.map(r => r.title);
    expect(result.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(helper.blogToAdd.title)
  
    const filter = {title: helper.blogToAdd.title};
    const toObjectOptions = {transform : (doc, ret) => { delete ret._id; delete ret.__v; ret.user = ret.user.toString()}};
    const processedBlogs = await helper.getBlogsInDB(filter, toObjectOptions);
    expect(processedBlogs[0]).toEqual({...helper.blogToAdd, user: user.id});
  })
  
  test('No likes prop defaults to 0', async() => {
    const result = await api
    .post('/api/blogs')
    .send(helper.blogNoLikesProp)
    .set({'Accept': 'application/json', 'Authorization': `Bearer ${token}`})
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
    .set({'Accept': 'application/json', 'Authorization': `Bearer ${token}`})
    .expect(400);
  
    expect(result.body.error).toBeDefined();
    expect(result.body.error).toBe('bad request')
  })

  test('Unauthorized user cannot create blog', async () => {
    const result = await api
    .post('/api/blogs')
    .send(helper.blogToAdd)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(401);
  
    expect(result.body.error).toBe('token is missing or invalid')
  })
})


describe('Deleting blog', () => {

  test('Remove single blog', async () => {
  const blogs = await helper.getBlogsInDB();
  await api
  .delete(`/api/blogs/${blogs[0]._id}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(204)
  })

  test('Try to remove already removed blog', async () => {
    const nonExistantId = await helper.getNonExistantId();
    const result = await api
    .delete(`/api/blogs/${nonExistantId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
  })
})

describe('Updating blog', () => {

  test('Increasing blog likes by 1', async () => {
  const blogs = await helper.getBlogsInDB();
  const blogToUpdate = blogs[0];
  const result = await api
  .put(`/api/blogs/${blogToUpdate._id}`)
  .send({...blogToUpdate, likes:blogToUpdate.likes + 1})
  .expect(200)

  const filter = {_id: blogToUpdate._id};
  const updatedBlogs = await helper.getBlogsInDB(filter);
  expect(updatedBlogs[0].likes).toBe(blogToUpdate.likes + 1)
  })

  test('Try to update already removed blog', async () => {
    const blogs = await helper.getBlogsInDB();
    const blogToUpdate = blogs[0];
    await Blog.findByIdAndDelete(blogToUpdate._id)
    const result = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send({...blogToUpdate, likes:blogToUpdate.likes + 1})
    .expect(404)
     })
  
  test('Decreasing blog likes by 1', async () => {
    const blogs = await helper.getBlogsInDB();
    const blogToUpdate = blogs[0];
    const result = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send({...blogToUpdate, likes:blogToUpdate.likes - 1})
    .expect(200)

    const filter = {_id: blogToUpdate._id};
    const updatedBlogs = await helper.getBlogsInDB(filter);
    expect(updatedBlogs[0].likes).toBe(blogToUpdate.likes - 1)
  })

  test('Setting likes to negative ammount', async () => {
    const blogs = await helper.getBlogsInDB();
    const blogToUpdate = blogs[0];
    const result = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send({...blogToUpdate, likes: -1})
    .expect(400)
    
    expect(result.body.error).toBeDefined();
    expect(result.body.error).toBe('bad request');

    const filter = {_id: blogToUpdate._id};
    const updatedBlogs = await helper.getBlogsInDB(filter);
    expect(updatedBlogs[0].likes).toBe(blogToUpdate.likes)
  })
})

afterAll(() => {
    mongoose.connection.close();
});