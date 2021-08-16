const mongoose = require('mongoose')
const { Schema, model } = mongoose

const personSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = model('Person', personSchema)

module.exports = Person
