const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    console.log(blogs);
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
  
    const result = await blog.save()
    response.status(201).json(result)
  })

  module.exports = blogsRouter;
