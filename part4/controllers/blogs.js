const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { info, error } = require('../utils/logger')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// REST Crud: CREATE
// blogsRouter.post('/', async (request, response, next) => {
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes, userId } = request.body

  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  //controllers/login.js
  // const userForToken = {
  //   username: user.username,
  //   id: user._id,
  // }
  // const token = jwt.sign(userForToken, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  const blog = new Blog(
    {
      title: title,
      author: author,
      url: url,
      likes: likes || 0,
      user: user._id
    }
  )
  // savedBlog = await blog.save().catch(error => {
  //   //error(error), // logger.error()
  //   next(error) //Last middleware app.use(middleware.errorHandler)
  // })
  // response.status(201).json(savedBlog)

  // app.js require('express-async-errors') handels try-catch for async functions
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})



// REST cRud: READ
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1
  })
  response.json(blogs)
})
// REST cRud: READ
// next() route or middleware
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })
  blog ? response.json(blog) : response.status(404).end()
})


// REST crUd: UPDATE
blogsRouter.put('/:id', async (request, response) => {
  // https://github.com/blakehaswell/mongoose-unique-validator#find--updates
  const { title, author, url, likes, userId } = request.body
  const user = await User.findById(userId)

  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user._id
  }

  // https://fullstackopen.com/en/part3/saving_data_to_mongo_db#other-operations
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  user.blogs = user.blogs.concat(updatedBlog._id)
  await user.save()
  response.json(updatedBlog)
})


// REST cruD: DELETE
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


module.exports = blogsRouter
