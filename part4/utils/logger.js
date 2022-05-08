const info = (...params) => {
    console.log(...params)
  }
  
const error = (...params) => {
  console.error(...params)
}
  
// The file exports an object that has two fields, both of which are functions.
module.exports = {
  info, error
}
// The functions can be imported as destructured to its own variables
//const { info, error } = require('./utils/logger')
// info('message = ')
// error('error message =')
