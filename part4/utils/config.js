require('dotenv').config()

let PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI // process.env.NODE_ENV = 'test'
: process.env.DEV_MONGODB_URI // process.env.NODE_ENV = 'development' || 'production'

module.exports = {
  MONGODB_URI,
  PORT
}
