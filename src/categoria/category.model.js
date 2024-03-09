import { Schema, model } from "mongoose";

// Definición del esquema para la colección de categorías
const CategoriaEsquema = Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false // Deshabilita la versión del documento
});

// Crear y exportar el modelo de categoría utilizando el esquema definido
export default model('Categoria', CategoriaEsquema);
