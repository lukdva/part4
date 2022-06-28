const express = require('express')
const app = express()
const {MONGO_URI} = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const blogRouter = require('./controllers/blogs');
const {info, error} = require('./utils/logger');

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
app.use('/api/blogs', blogRouter);

module.exports = app;