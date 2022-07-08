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

afterAll(() => {
    mongoose.connection.close();
});