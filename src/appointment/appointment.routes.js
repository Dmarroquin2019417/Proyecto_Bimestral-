import { Router } from 'express';
import { validarCampos } from '../middlewares/validar-campos.js';
import { agregarAlCarrito, procesoDeCompra, obtenerHistorialCompras } from './appointment.controller.js'; // Ajusta el nombre del controlador según tu estructura
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

// Ruta para agregar un producto al carrito de compras
router.post('/', [validarJWT, validarCampos], agregarAlCarrito);

// Ruta para completar el proceso de compra
router.post('/proceso-compra', validarJWT, procesoDeCompra);

router.get('/historial', validarJWT, obtenerHistorialCompras);

export default router;
