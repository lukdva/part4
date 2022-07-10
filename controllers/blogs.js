const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    if(!(request.body.url && request.body.title)) 
      throw new Error('bad request'); 
    if (!request.body.likes) 
      request.body.likes = 0;
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const result = await Blog.deleteOne({_id:request.id});
    if(result.acknowledged === true && result.deletedCount === 0)
      throw new Error('not found');
    response.status(204).send();
  })

  module.exports = blogsRouter;
