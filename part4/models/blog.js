// import { connect, Schema, model, connection } from 'mongoose'
const mongoose = require('mongoose')

// https://fullstackopen.com/en/part3/saving_data_to_mongo_db#schema
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 5, // Validator
    required: true // https://mongoosejs.com/docs/validation.html#built-in-validators
  },
  author: String,
  url:  {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Database document reference name is stored in both documents
  }
})

// Handle MongoDB id from object to string
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Collection name 'Blog' will be in plural 'blogs' on DataBase (just like in SQL tables)
module.exports = mongoose.model('Blog', blogSchema)
