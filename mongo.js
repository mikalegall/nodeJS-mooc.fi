// import { connect, Schema, model, connection } from 'mongoose'
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@nodejs.uvgnh.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

// https://fullstackopen.com/en/part3/saving_data_to_mongo_db#schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


// Collection name 'ContactInformation' will be in plural 'contactinformations' like in SQL tables
const Person = mongoose.model('Person', personSchema)

if (number) {

  const person = new Person({
    name: name,
    number: number,
  })


  person.save().then(result => {
    /*
    // Result is the saved object aka Document
    {
      name: 'Arto Hellas',
      number: '040-123456',
      _id: new ObjectId("62751f337d3d653a44ccea41"),
      __v: 0
    }
    */
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}


console.log('Phonebook:')
// https://www.mongodb.com/docs/manual/reference/operator/
//ContactInformation.find( { name: 'Anna' } ).then(result => {
Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note.name, note.number)
  })
  mongoose.connection.close()
})

