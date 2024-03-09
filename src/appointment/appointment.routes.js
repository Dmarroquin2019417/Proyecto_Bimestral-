import { Router } from 'express';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { agregarAlCarrito, procesoDeCompra, obtenerHistorialCompras, editarFactura, obtenerFacturasUsuario, obtenerProductosFactura } from './appointment.controller.js'; 

const router = Router();

// Rutas existentes
router.post('/', [validarJWT, validarCampos], agregarAlCarrito);
router.post('/proceso-compra', validarJWT, procesoDeCompra);
router.get('/historial', validarJWT, obtenerHistorialCompras);

// Rutas nuevas para editar factura, obtener facturas de usuario y obtener productos de factura
router.put('/:facturaId', [validarJWT, validarCampos], editarFactura);
router.get('/facturas/:userId', validarJWT, obtenerFacturasUsuario);
router.get('/productos/:facturaId', validarJWT, obtenerProductosFactura);

export default router;
