const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
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
//app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :body'))  // https://github.com/expressjs/morgan
app.use(middleware.requestLogger)
// use the middleware in all routes
app.use(middleware.tokenExtractor)


//app.use(middleware.userExtractor)
// Base endpoint for blogs:
// Use the middleware userExtractor only in /api/blogs routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
// Base endpoint for users
app.use('/api/users', usersRouter)
// Base endpoint for login
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) // This has to be the last loaded middleware

module.exports = app
