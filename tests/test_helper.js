const mongoose = require('mongoose')
const Blog = require('../models/blog')

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

const getBlogsInDB = async (filter = {}, toObjectOps = {}) => {
    const blogs = await Blog.find(filter);
    return blogs.map(blog => blog.toObject(toObjectOps));
}

const getNonExistantId = async () => {
    const blog = new Blog(blogToAdd);
    await blog.save();
    await blog.remove();

    return blog._id.toString();
}

module.exports = {
    initialBlogs,
    blogToAdd,
    blogNoLikesProp,
    blogNoUrlTitle,
    getBlogsInDB,
    getNonExistantId
}