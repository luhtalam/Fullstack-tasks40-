const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
//app.use(morgan('tiny'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response) => {
    Person
        .count({})
        .then(result => {
            const res = `<p>Puhelinluettelossa ${result} henkilön tiedot</p>
                    <p>${new Date()}</p>`
            response.send(res)
        })
        .catch(error => {
            console.log(error)
            response.status(404).send({ error: 'no connection to database' })
        })
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!checkValidity(body, response)) {
        return response
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
        .catch(error => {
            response.status(404).send({ error: 'no connection to database' })
        })
})

const checkValidity = (body, response) => {
    console.log(databaseContainsName(body.name))
    if (body.name === undefined || body.name === "") {
        response.status(400).json({ error: 'name missing' })
        return false
    } else if (body.number === undefined || body.number === "") {
        response.status(400).json({ error: 'number missing' })
        return false
    } else if (databaseContainsName(body.name)) {
        console.log(databaseContainsName(body.name))
        response.status(400).json({ error: 'name must be unique' })
        return false
    } else {
        return true
    }
}

const databaseContainsName = (name) => {
    Person.find({name: name}).then(persons => {
        console.log(persons)
        return persons.length !== 0
    })
}

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(formatPerson(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

// const generateId = () => {
//     const random = Math.random()
//     const upperBound = 100000
//     return Math.ceil(random * upperBound)
// }

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Martti Tienari",
//         "number": "040-123456",
//         "id": 2
//     },
//     {
//         "name": "Arto Järvinen",
//         "number": "040-123456",
//         "id": 3
//     },
//     {
//         "name": "Lea Kutvonen",
//         "number": "040-123456",
//         "id": 4
//     }
// ]