const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { info, error } = require('../utils/logger')

// REST Crud: CREATE
// blogsRouter.post('/', async (request, response, next) => {
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const token = request.get('token')
  const user = request.get('user')

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = new Blog(
    {
      title: title,
      author: author,
      url: url,
      likes: likes || 0,
      user: user.id
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
  const { title, author, url, likes } = request.body

const userId = request.headers.user._id.toString()

const blog = await Blog.findById(request.params.id)

if (!blog) {
  return response.status(400).json({
    error: `Id ${request.params.id} does not exist SUOMI`
  })
} else if (blog.user.toString() === userId) {

  const newBlogEntry = {
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: userId
  }

  // https://fullstackopen.com/en/part3/saving_data_to_mongo_db#other-operations
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlogEntry, { new: true, runValidators: true, context: 'query' })
  //user.blogs = user.blogs.concat(updatedBlog._id)
  //await user.save()
  response.json(updatedBlog)

} else {

  return response.status(403).json({
    error: 'Blog can be updated only by the owner'
  })

}


})


// REST cruD: DELETE
blogsRouter.delete('/:id', async (request, response) => {

  const user = request.get('user')
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: `Id ${request.params.id} does not exist`
    })
  } else if (blog.user.toString() === user.id.toString()) {

    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()

  } else {

    return response.status(403).json({
      error: 'Blog can be deleted only by the owner'
    })

  }

})


module.exports = blogsRouter
