import { Router } from "express";
import { check } from "express-validator";
import {
    obtenerUsuarios,
    agregarUsuario,
    modificarRolUsuario,
    editarUsuario,
    eliminarUsuario
} from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// Ruta para obtener la lista de usuarios
router.get("/", obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
    ],
);

// Ruta para agregar un nuevo usuario
router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("correo", "El correo es obligatorio").isEmail(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        check("role", "El rol es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    agregarUsuario
);

// Ruta para modificar el rol de un usuario
router.put(
    "/modificar-rol/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("role", "El rol es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    modificarRolUsuario
);

// Ruta para editar la información de un usuario
router.put(
    "/editar/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("correo", "El correo es obligatorio").isEmail(),
        check("role", "El rol es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    editarUsuario
);

// Ruta para eliminar un usuario
router.delete(
    "/eliminar/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
    ],
    eliminarUsuario
);

export default router;
