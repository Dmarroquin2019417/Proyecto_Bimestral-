import { Router } from 'express';
import { validarCampos } from '../middlewares/validar-campos.js';
import { agregarAlCarrito } from './carrito.controller.js'; // Ajusta el nombre del controlador según tu estructura
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

// Ruta para agregar un producto al carrito de compras
router.post('/', [validarJWT, validarCampos], agregarAlCarrito);

export default router;
  //"date": "2024-03-10T08:00:00.000Z",
  //"productId": "ID_DEL_PRODUCTO_A_AGREGAR_AL_CARRITO"

