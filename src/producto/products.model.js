
import mongoose from 'mongoose';

// Definir el esquema para el modelo de producto
const ProductoSchema = mongoose.Schema({
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
  estado: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true // Agrega campos de fecha de creación y actualización automáticamente
});

// Exportar el modelo de producto
export default mongoose.model('Producto', ProductoSchema);
