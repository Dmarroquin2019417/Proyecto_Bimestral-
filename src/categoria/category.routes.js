import { Router } from "express";
import { check } from "express-validator";
import { agregarCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, eliminarCategoria } from "../categoria/category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

// Crear un router para las rutas relacionadas con las categorías
const router = Router();

// Ruta para agregar una nueva categoría
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre de la categoría es requerido').not().isEmpty(),
        check('descripcion', 'La descripción de la categoría es requerida').not().isEmpty(),
        validarCampos
    ], agregarCategoria);

// Ruta para obtener la lista de todas las categorías
router.get('/', obtenerCategorias);

// Ruta para obtener una categoría por su ID
router.get(
    '/:id',
    [
        validarJWT,
        check('id', 'El ID de la categoría no es válido').isMongoId(),
        validarCampos
    ], obtenerCategoriaPorId);

// Ruta para actualizar una categoría por su ID
router.put('/:id',
    [
        validarJWT,
        check('id', 'El ID de la categoría no es válido').isMongoId(),
        check('nombre', 'El nombre de la categoría es requerido').not().isEmpty(),
        check('descripcion', 'La descripción de la categoría es requerida').not().isEmpty(),
        validarCampos
    ], actualizarCategoria);

// Ruta para eliminar una categoría por su ID
router.delete('/:id',
    [
        validarJWT,
        check('id', 'El ID de la categoría no es válido').isMongoId(),
        validarCampos
    ], eliminarCategoria);

// Exportar el router
export default router;
