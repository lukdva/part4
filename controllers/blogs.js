const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1, id:1});
    response.json(blogs);
  })
  
  blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    if(!(request.body.url && request.body.title)) 
      throw new Error('bad request'); 
    if (!request.body.likes) 
      request.body.likes = 0;
    const user = await User.findById(request.user.id);
    const blog = new Blog({...request.body, user:user._id});
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  })

  blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const userId = request.user.id;
    const blog = await Blog.findById(request.params.id);
    if(!blog)
      response.status(404).send({error:'not found'})
    if(blog.user.toString() !== userId)
      response.status(401).json({error:'You are not the owner of resource'})
    await blog.remove();
    response.status(204).send();
  })

  blogsRouter.put('/:id', async (request, response) => {
    if (request.body.likes < 0 )
      throw new Error('bad request')
    const result = await Blog.findByIdAndUpdate(request.params.id, {...request.body}, {new: true, runValidators: true});
    if(!result)
      response.status(404).json({error: 'Blog not found'})
    response.status(200).json(result.body)
  })
  module.exports = blogsRouter;
