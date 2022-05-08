const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// Allow connections from 0.0.0.0/0 everywhere (SECURITY RISK!)
app.use(cors())
// Frontend files can be serve from root directory
app.use(express.static('reactbuild'))
app.use(express.json())
app.use(middleware.requestLogger)

// Base endpoint for blogs
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) // This has to be the last loaded middleware

module.exports = app
