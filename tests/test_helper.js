const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

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
const initialUsers = [
  {
    username: "test1",
    name: "Test Best",
    password: "secur1ty"
  },
  {
    username: "jdoe",
    name: "John Doe",
    password: "s3cur1ty"
  }
]
const userNoPassword = {
  username: "noPwHere",
  name: "Password protection"
}
const userNoUsername = {
  name: "Username Strong",
  password: "NoUsername"
}
const userShortPassword = {
    username: "shorty",
    name: "Nate Robinson",
    password: "s3"
}
const userShortUsername = {
  username: "sh",
  name: "Yao Ming",
  password: "s3cur1ty"
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

const getUsersInDB = async (filter = {}, toObjectOps = {}) => {
  const users = await User.find(filter);
  return users.map(user => user.toObject(toObjectOps));
}

module.exports = {
    initialBlogs,
    blogToAdd,
    blogNoLikesProp,
    blogNoUrlTitle,
    initialUsers,
    userNoPassword,
    userNoUsername,
    userShortPassword,
    userShortUsername,
    getBlogsInDB,
    getNonExistantId,
    getUsersInDB
}