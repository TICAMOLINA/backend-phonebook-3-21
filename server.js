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

app.delete('/api/persons/:id', (req, res) => {
    //! App llama al método DELETE definiendo en la ruta el id (:id), para ENCONTRAR uno de los elementos (el que se desea eliminar que conicida con dicho id)
    const id = Number(req.params.id)
    //! define constante id la cual con el metodo number transforma a numero el id de la peticion, que se obtiene con el metodo params y id. Se transforma a numero porque este es del tipo string, y los ids que estan en los datos son numeros, por lo que en la posterior comparacion y busqueda si no se realiza la transformacion devolveria undefined
    persons = persons.filter((p) => p.id !== id)
    //! a diferencia del GET, en funcion del id no se va a buscar un solo resultado, sino que sobre el array persons se realiza una copia, y con el metodo filter se preservaran los datos no coincidentes con el id del elemento que se busca eliminar
    console.log(persons)

    res.status(204).end()
    //! La respuesta finaliza con un status 204, es decir una solicitud que fue procesada con exito pero que no necesita devolver dato alguno
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
