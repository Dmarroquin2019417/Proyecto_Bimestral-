import { Router } from "express";
import { check } from "express-validator";
import { 
    agregarProducto, 
    obtenerProductos, 
    obtenerProductoPorId, 
    actualizarProducto, 
    eliminarProducto,
    identificarProductosAgotados,
    obtenerProductosMasVendidos,
} from "../producto/products.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// Rutas para productos
router.post(
  "/", 
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("precio", "El precio es obligatorio").isNumeric(),
    check("cantidadDisponible", "La cantidad disponible es obligatoria").isNumeric(),
    validarCampos
  ], 
  agregarProducto
);

router.get("/", obtenerProductos);
router.get("/agotados", identificarProductosAgotados);
router.get('/mas-vendidos', obtenerProductosMasVendidos);

router.get("/:id", obtenerProductoPorId);

router.put(
  "/:id", 
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("precio", "El precio es obligatorio").isNumeric(),
    check("cantidadDisponible", "La cantidad disponible es obligatoria").isNumeric(),
    validarCampos
  ], 
  actualizarProducto
);

router.delete("/:id", validarJWT, eliminarProducto);


export default router;
