const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// REST Crud: CREATE
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username === undefined) {
    return response.status(400).json({
      error: 'Username missing'
    })
  } else if (username.length < 3) {
    return response.status(411).json({
      error: 'Username must contain at least 3 characters'
    })
  }

  if (password === undefined) {
    return response.status(400).json({
      error: 'Password missing'
    })
  } else if (password.length < 3) {
    return response.status(411).json({
      error: 'Password must contain at least 3 characters'
    })
  }


  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// REST cRud: READ
usersRouter.get('/', async (request, response) => {
  // Parameter given to the populate() defines that the ids referencing objects in the given 
  // 'blogs' field of the User document will be replaced by the referenced documents
  // https://fullstackopen.com/en/part4/user_administration#populate
  const users = await User.find({}).populate('blogs', {
    title: 1, // https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-_id-field-only
    author: 1,
    url: 1,
    likes: 1
  })
  response.json(users)
})

module.exports = usersRouter