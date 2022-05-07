// import { connect, Schema, model, connection } from 'mongoose'
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


// https://fullstackopen.com/en/part3/saving_data_to_mongo_db#schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3, // Validator
    required: [true, 'User name required'] // https://mongoosejs.com/docs/validation.html#built-in-validators
  },
  number: {
    type: String,
    validate: { // https://mongoosejs.com/docs/validation.html#custom-validators
      validator: function (v) {
        if (/.{9,}/.test(v)) { // Test if the string lenght is min 9 chars
          // brackets () forms a group
          // caret ^ match start --> first group must start with min 2 and max 3 digits
          // \d match digits 0-9 in string
          // inside curly brackets {} min and max value
          // $ match end --> last group must end with min 6 digits
          return /^(\d{2,3})-(\d{5,})$/.test(v)
        } else {
          return false // String lenght was under 9 chars
        }
        // 09-1234556 and 040-22334455 are valid
        // 1234556, 1-22334455 and 10-22-334455 are invalid
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
})
// When the response is sent in the JSON format, the 'toJSON' method of each object
// in the array is called automatically by the JSON.stringify() method.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Mongoose Object _ID to id String
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Collection name 'ContactInformation' will be in plural 'contactinformations' like in SQL tables
module.exports = mongoose.model('Person', personSchema)
