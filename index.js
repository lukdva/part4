const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {PORT, MONGO_URI} = require('./utils/config')
const {info, error} = require('./utils/logger');
const blogRouter = require('./controllers/blogs');

mongoose.connect(MONGO_URI)

app.use(cors())
app.use(express.json())
app.use(blogRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})