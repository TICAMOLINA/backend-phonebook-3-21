import express from 'express'
import morgan from 'morgan'
import cors from 'cors' //! INSTALA CORS
import 'dotenv/config'
import Person from './models/person.js'

const app = express()


morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors()) //! IMPLEMENTA CORS

app.use(express.static('dist'))



app.get('/', (req, res) => {
    res.send('<h1>Hello Worlda!</h1>')
})

app.get('/info', (req, res) => {
    let myDate = new Date()
    
    Person.find({}).then(persons => {
        res.status(200).send(`<p>Phonebook has info of ${persons.length} people</p>
        <p>${myDate}</p>`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.status(200).json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(returnedPerson => {
            if (returnedPerson) {
                res.json(returnedPerson)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
    const newPerson = req.body

    if (newPerson.name === undefined || newPerson.phone === undefined) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: newPerson.name,
        phone: newPerson.phone
    })

    person.save().then(savedPerson => {
        res.status(201).json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.status(200).json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
// controlador de solicitudes que resulten en errores
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
