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
    res.send(`<p>Phonebook has info of ${persons.length} people</p>
    <p>${myDate}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.status(200).json(persons)
    })
    // res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id).then(returnedPerson => {
        res.status(200).json(returnedPerson)
    })
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

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
