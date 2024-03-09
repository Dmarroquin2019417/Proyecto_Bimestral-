import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
    facturaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Suponiendo que tienes un modelo de usuario llamado User
    },
    productos: [
        {
            nombre: String,
            precio: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Factura = mongoose.model('Factura', facturaSchema);

export default Factura;
