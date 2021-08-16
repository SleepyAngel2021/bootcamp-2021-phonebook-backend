const mongoose = require('mongoose')
const Person = require('./models/Person')

// const connectionString = process.env.MONGO_DB_URI

if (process.argv.length < 3) {
  console.log(
    'Please provide the password a an argument: node mongo.js <password>'
  )
  process.exit(1)
} else if (process.argv.length > 3 && process.argv.length !== 5) {
  console.log(
    'If you want add person remeber pass the name(Anna or "Anna García") and number: node mongo.js <password> <name> <number>'
  )
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://josepbc:${password}@cluster0.lfbgp.mongodb.net/phonebook-app?retryWrites=true&w=majority`

// connect to MongoDB
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connected')

    if (!name && !number) {
      Person.find({}).then(result => {
        result.map(person => console.log(`${person.name} ${person.number}`))
      })
    } else {
      const person = new Person({
        name,
        number,
      })
      person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
      })
    }
  })
  .catch(err => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
