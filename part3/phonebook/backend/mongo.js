const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/phonebook'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+/.test(v)
      },
    },
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(people => {
      console.log(people.name, ' ', people.number)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 4) {
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
    .catch(error => {
      console.log(error.message)
    })
}
else {
  console.log('Please provide name and number: node mongo.js <name> <number>')
  process.exit(1)
}
