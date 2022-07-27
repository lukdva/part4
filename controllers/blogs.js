const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1, id:1});
    response.json(blogs);
  })
  
  blogsRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if(!decodedToken.id)
    {
      response.status(401).json({error: 'token is missing or invalid'});
    }

    if(!(request.body.url && request.body.title)) 
      throw new Error('bad request'); 
    if (!request.body.likes) 
      request.body.likes = 0;

    const user = await User.findById(decodedToken.id);
    const blog = new Blog({...request.body, user:user._id});
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const userId = decodedToken.id
    if(!userId)
    {
      response.status(401).json({error: 'token is missing or invalid'});
    }
    console.log("decodedToken.id: ", userId)
    console.log("request.params.id: ",request.params.id)
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
    const result = await Blog.findByIdAndUpdate({_id:request.params.id}, {...request.body}, {new: true, runValidators: true});
    console.log('RESULT',result);
    response.status(200).json(result.body)
  })
  module.exports = blogsRouter;
