

import { Schema, model } from "mongoose";

// Definir el esquema para el modelo de producto
const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
  },
  cantidadDisponible: {
    type: Number,
    default: 0, 
    min: [0, 'La cantidad disponible no puede ser negativa'] 
},
categoria: {
  type: Schema.ObjectId,
  ref: 'Categoria',
  required: true,
},
  estado: {
    type: Boolean,
    default: true,
  },
  
}, {
  timestamps: true // Agrega campos de fecha de creación y actualización automáticamente
});

// Exportar el modelo de producto
export default model('Producto', ProductoSchema);
