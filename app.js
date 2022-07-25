const express = require('express')
const app = express()
require('express-async-errors');
const {MONGO_URI} = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const {info, error} = require('./utils/logger');
const middleware = require('./utils/middleware');

info('connecting to MongoDB')

mongoose.connect(MONGO_URI)
.then(() => {
    info('connected to mongoDB')
})
.catch(err => {
    error('error connecting to MongoDB: ', err);
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogRouter);
app.use(middleware.handleBadRequests);

module.exports = app;