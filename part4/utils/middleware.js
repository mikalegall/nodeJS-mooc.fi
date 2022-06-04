const logger = require('./logger')
const jwt = require('jsonwebtoken');
const User = require('../models/user')


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

/* 
// Middleware logger
var morgan = require('morgan') // npm install morgan
morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // https://github.com/expressjs/morgan
 */


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {

  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // https://stackoverflow.com/questions/36891658/expressjs-append-header-to-incoming-request-object
    request.headers.token = authorization.substring(7)
  }

  next()
}


const userExtractor = async (request, response, next) => {

  const token = request.headers.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'Token missing or invalid (can not extract user)'
    })
  }

  request.headers.user = await User.findById(decodedToken.id)

  next()
}


module.exports = {
  requestLogger,
  //morgan,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
