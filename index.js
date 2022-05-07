require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
// app.use() means "Start using middleware"

const cors = require('cors')
app.use(cors()) // npm install cors

// https://fullstackopen.com/osa3/node_js_ja_express#middlewaret
app.use(express.static('reactbuild')) // Serve pages primarily from directory 'build'
// https://fullstackopen.com/osa3/node_js_ja_express#datan-vastaanottaminen
app.use(express.json()) // JSON-parser: https://expressjs.com/en/api.html

// Middleware logger
var morgan = require('morgan') // npm install morgan
morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // https://github.com/expressjs/morgan

// let persons = [
//     {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//     },
//     {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//     },
//     {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//     },
//     {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//     }
// ]


// REST Crud: CREATE
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name.trim(),
    number: body.number.trim(),
  })

  person.save().then(result => {
    console.log(`Added ${body.name.trim()} number ${body.number.trim()} to phonebook`)
    response.json(result)
  })
    .catch(error => {
      next(error)
    }
    )

})

// REST cRud: READ
app.get('/', (req, res) => {
  console.log('request.headers = ', req.headers)
  res.send('<h1>Hello World!</h1>')
})
// REST cRud: READ
app.get('/info', (req, res, next) => {

  let persons = 0
  Person.find({}).then(contacts => {
    persons = contacts
    res.send(`Phonebook has info for ${persons.length} people` + '<br>' + `${new Date()}`)
  })
    .catch(error => next(error))
})
// REST cRud: READ
app.get('/api/persons', (req, res, next) => {
  // https://www.mongodb.com/docs/manual/reference/operator/
  // Person.find( { name: 'Anna' } ).then
  Person.find({}).then(contacts => {
    res.json(contacts)
  })
    .catch(error => next(error))
})
// REST cRud: READ
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {

    if (person) {
      response.json(person)
    } else {
      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


// REST crUd: UPDATE
app.put('/api/persons/:id', (request, response, next) => {

  // https://github.com/blakehaswell/mongoose-unique-validator#find--updates
  //const { name, number } = request.body
  const name = request.body.name.trim()
  const number = request.body.number.trim()

  // https://fullstackopen.com/en/part3/saving_data_to_mongo_db#other-operations
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// REST cruD: DELETE
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
} // app.use() means "Start using middleware"
app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ name: 'ValidationError', errormessage: error.message })
  }

  next(error)
}
app.use(errorHandler) // This has to be the last loaded middleware



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

