const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    }
  ]
  const blogToAdd =
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }
  const blogNoLikesProp =
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
    }
  const blogNoUrlTitle =
    {
      author: "Robert C. Martin",
      likes: 10
    }

  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogArray = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogArray.map(blog => blog.save())
    await Promise.all(promiseArray);
  })
test('Blogs are returned in JSON format and a correct number of blogs', async () => {
    const result = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    expect(result.body.length).toEqual(initialBlogs.length)
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
  .send(blogToAdd)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(201);

  const result = await api.get('/api/blogs');
  const titles = result.body.map(r => r.title);
  expect(result.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(blogToAdd.title)

  const dbRecords = await Blog.find({title:blogToAdd.title});
  const processedBlogs = dbRecords.map(r => r.toObject({transform : (doc, ret) => { delete ret._id; delete ret.__v}}));
  console.log(processedBlogs);
  expect(processedBlogs[0]).toEqual(blogToAdd);
  
})

test('No likes prop defaults to 0', async() => {
  const result = await api
  .post('/api/blogs')
  .send(blogNoLikesProp)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(201);
  // expect.
  console.log(result.body);
  expect(result.body.likes).toBeDefined();

  const dbRecords = await Blog.find({title:blogNoLikesProp.title});
  const processedBlogs = dbRecords.map(r => r.toObject());
  expect(processedBlogs[0].likes).toBe(0);
})

test.only('No URL and Title returns 400 status', async() => {
  const result = await api
  .post('/api/blogs')
  .send(blogNoUrlTitle)
  .set('Accept', 'application/json')
  .expect(400);

  expect(result.body.error).toBeDefined();
  expect(result.body.error).toBe('bad request')
})

afterAll(() => {
    mongoose.connection.close();
});