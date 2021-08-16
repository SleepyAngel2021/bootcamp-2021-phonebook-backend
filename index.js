require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()

const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))

const unknownEndPoint = require('./middleware/unknownEndPoint')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

const Person = require('./models/Person')

// home
app.get('/', morgan('tiny'), (req, res) => {
  res.end('<h1>Home</h1>')
})

// get all
app.get('/api/persons', morgan('tiny'), (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons).status(200).end()
    })
    .catch(err => next(err))
})

// info
app.get('/info', morgan('tiny'), (req, res, next) => {
  Person.find({})
    .then(persons => {
      const date = new Date()
      const template = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `
      res.status(200).end(template)
    })
    .catch(err => next(err))
})

// get by id
app.get('/api/persons/:id', morgan('tiny'), (req, res, next) => {
  const { id } = req.params
  Person.findById(id)
    .then(person => {
      if (person) res.json(person).status(200).end()
      res.status(404).end()
    })
    .catch(err => next(err))
})

// delete by id
app.delete('/api/persons/:id', morgan('tiny'), (req, res, next) => {
  const { id } = req.params

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

// add person
app.post(
  '/api/persons',
  morgan(':method :url :status :res[content-length] :response-time ms :body'),
  (req, res, next) => {
    const person = req.body

    if (person.name === undefined || person.number === undefined) {
      return res.status(400).json({
        error: 'name or number is missing',
      })
    }

    const newPerson = new Person({
      name: person.name,
      number: person.number,
    })

    newPerson
      .save()
      .then(savedPerson => res.json(savedPerson).status(201).end())
      .catch(err => next(err))
  }
)

// update person
app.put('/api/persons/:id', morgan(':body'), (req, res, next) => {
  const { id } = req.params
  const { name, number } = req.body

  const upPerson = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(id, upPerson, { new: true }, (err, model) => {
    if (!model) {
      next(err)
    } else {
      return model
    }
  })
    .then(result => res.json(result).status(204).end())
    .catch(err => next(err))
})

app.use(unknownEndPoint)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`You can watch your server in http://localhost:${PORT}`)
})
