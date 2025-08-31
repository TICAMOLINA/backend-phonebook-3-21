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
    //! App llama al método GET definiendo en la ruta el id (:id), para obtener uno de los elementos
    const id = Number(req.params.id)
    //! define constante id la cual con el metodo number transforma a numero el id de la peticion, que se obtiene con el metodo params y id. Se transforma a numero porque este es del tipo string, y los ids que estan en los datos son numeros, por lo que en la posterior comparacion y busqueda si no se realiza la transformacion devolveria undefined
    const person = persons.find((p) => p.id === id)
    //! la constante person es una busqueda en el array persons (o sea los datos) que devolvera el elemento que resulte verdadero en la comparativa de los ids existentes con el obtenido en el req
    if (person) {
        res.json(person)
        //! Si la busqueda anterior devuelve resultado, en la respuesta con metodo el metodo json se incluye dicho resultado 
    } else {
        res.status(404).end()
        //! Si la busqueda no arroja resultado, se finaliza con un estado 404, sin devolverle dato alguno al usuario mas que el mensaje del error 404
    }
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

const generateId = () => {
    //? Funcion que crearetorna el resultado de la constante newId. Math random, devuelve un numero aleatorio entre 0 y 10000 (no incluidos), y math floor lo convierte al numero entero menor mas proximo
    const newId = Math.floor(Math.random() * 10000)
    return newId
}

app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    //! La constante newPerson obtiene el body de la peticion (las propiedades de cada elemento)
    //? TENER EN CUENTA EL USO DEL MIDDLEWARE APP.USE(EXPRESS.JSON())

    if (newPerson.name === "" || newPerson.phone === "") {
        //! si en el body, los campos name y number vienen vacios se responde y finaliza la ejecucion del codigo con un status 400, y un mensaje de error con metodo json
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const names = persons.map((p) => p.name)
    //! Para propiciar una futura comparacion y verificar si el nombre existe, primero crea constante names (con map crea un nuevo array con los name de cada persona)
    const matchName = names.includes(newPerson.name)
    //! la constante matchName devuelve Boolean, con metodo include, verifica si entre los nombres del array creado con anterioridad se encuentra el nombre que viene en la peticion del usuario. 
    if (matchName) {
        //! si matchName es true, es decir si el nombre ya se encuentra en la agenda detiene la ejecucion del codigo con el estado de error 400, y una respuesta en json con el mensaje de que el nombre debe ser unico
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const addedPerson = {
        //! En caso de superar todas las verificaciones se crea un nuevo objeto con los datos name y number de la peticion, y se incluye un id que es el numero obtenido de la funcion generateId, la cual se ejecuta en este punto
        name: newPerson.name,
        phone: newPerson.phone,
        id: generateId()
    }

    persons = persons.concat(addedPerson)
    //! se reemplaza los datos originales con el metodo concat, el cual agregara en un nuevo array los datos del objeto anterior
    res.status(201).json(addedPerson)
    //! se devuelve una respuesta con codigo 201 (de creacion exitosa), y mostrara con json los datos nuevos
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})