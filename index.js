const express = require('express')
const cors = require('cors')
const app = express()

const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

//home
app.get('/', morgan('tiny'), (req, res) => {
  res.end('<h1>Home</h1>')
})

//get all
app.get('/api/persons', morgan('tiny'), (req, res) => {
  res.json(persons).status(200).end()
})

//info
app.get('/info', morgan('tiny'), (req, res) => {
  const pers = persons.length
  const date = new Date()
  const template = `
    <p>Phonebook has info for ${pers} people</p>
    <p>${date}</p>
  `
  res.status(200).end(template)
})

//get by id
app.get('/api/persons/:id', morgan('tiny'), (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(item => item.id === id)

  if (person) {
    res.json(person).status(200).end()
  } else {
    res.status(404).end()
  }
})

//delete by id
app.delete('/api/persons/:id', morgan('tiny'), (req, res) => {
  const id = Number(req.params.id)

  const personExist = persons.find(item => item.id === id)

  if (!personExist) {
    res
      .status(404)
      .json({
        error: 'the id is missing',
      })
      .end()
  } else {
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  }
})

//add person
app.post(
  '/api/persons',
  morgan(':method :url :status :res[content-length] :response-time ms :body'),
  (req, res) => {
    const person = req.body

    if (!person || !person.name) {
      return res
        .status(400)
        .json({
          error: 'person.name is missing',
        })
        .end()
    } else if (!person || !person.number) {
      return res
        .status(400)
        .json({
          error: 'person.number is missing',
        })
        .end()
    }

    const exist = persons.some(item => item.name === person.name)

    //303 (see other) or 409 (conflict)
    if (exist) {
      return res
        .status(303)
        .json({
          error: 'name must be unique',
        })
        .end()
    }

    const ids = persons.map(person => person.id) || 1
    const maxId = Math.max(...ids)

    const newPerson = {
      id: maxId + 1,
      name: person.name,
      number: person.number,
    }

    persons = [...persons, newPerson]

    res.status(201).json(newPerson).end()
  }
)

//update person
app.put('/api/persons/:id', morgan(':body'), (req, res) => {
  const id = Number(req.params.id)
  const { number } = req.body
  const ind = persons.findIndex(pers => pers.id === id)

  if (ind !== -1) {
    persons[ind].number = number
    res.status(200).json(persons[ind]).end()
  } else {
    res.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`You can watch your server in http://localhost:${PORT}`)
})
