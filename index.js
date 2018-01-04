const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
//app.use(morgan('tiny'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response) => {
    const res = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>`
    response.send(res)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const random = Math.random()
    const upperBound = 100000
    return Math.ceil(random * upperBound)
}

const checkValidity = (body, response) => {
    if (body.name === undefined || body.name === "") {
        response.status(400).json({ error: 'name missing' })
    } else if (body.number === undefined || body.number === "") {
        response.status(400).json({ error: 'number missing' })
    } else if (persons.find(person => person.name === body.name)) {
        response.status(400).json({ error: 'name must be unique' })
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    checkValidity(body, response)

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]