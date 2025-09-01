import mongoose from "mongoose";
import 'dotenv/config'

mongoose.set('strictQuery', false)
//! El ajuste mongoose.set('strictQuery', false) controla cómo Mongoose maneja las propiedades que no existen en el esquema cuando hacés una consulta. Permite usar cualquier campo, aunque no esté en el schema.

const url = process.env.MONGODB_URI
//console.log('Coneccting to ', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

personSchema.set('toJSON', { // opción del schema que define cómo se serializa a JSON un documento Mongoose
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
/*  Crea un campo id “lindo” para el front (string simple).
_id es un ObjectId (tipo especial de MongoDB); pasarlo a string facilita usarlo como key en React, etc.*/
    delete returnedObject._id
/* Oculta el campo _id original (ya no hace falta porque tenemos id).*/
    delete returnedObject.__v
/* Quita __v, que es la clave de versión interna de Mongoose (sirve para control de concurrencia y versionado de documentos).
No aporta nada al cliente y confunde.  */
  }
})

export default mongoose.model('Person', personSchema)
// export default mongoose.model('Person', personSchema) crea y exporta por defecto un modelo de Mongoose llamado Person, basado en el personSchema. Este modelo representa la colección people en la base de datos y se usa para interactuar con ella (consultar, guardar, actualizar, eliminar documentos).