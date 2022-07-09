const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    console.log(blogs);
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    if(!(request.body.url && request.body.title)) 
      {
        throw new Error('bad request'); 
      }
    if (!request.body.likes) request.body.likes = 0;
    console.log('request', request)
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  })

  module.exports = blogsRouter;
