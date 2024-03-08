import bcryptjs from 'bcryptjs';

import User from './user.model.js';


export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();

        res.status(200).json({
            usuarios,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Agrega un nuevo usuario
export const agregarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password, role, estado } = req.body;
        
        // Verifica si el correo ya está registrado
        const existeUsuario = await User.findOne({ correo });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encripta la contraseña
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        // Crea el nuevo usuario
        const nuevoUsuario = new User({
            nombre,
            correo,
            password: hashedPassword,
            role,
            estado
        });

        // Guarda el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(201).json({
            message: "Usuario creado correctamente",
            user: nuevoUsuario,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Modifica el rol de un usuario
export const modificarRolUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Busca el usuario por ID
        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualiza el rol del usuario
        usuario.role = role;
        await usuario.save();

        res.status(200).json({
            message: 'Rol de usuario modificado correctamente',
            user: usuario,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edita la información de un usuario
export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, password, role, estado } = req.body;

        // Busca el usuario por ID
        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualiza la información del usuario
        usuario.nombre = nombre;
        usuario.correo = correo;
        usuario.role = role;
        usuario.estado = estado;

        // Encripta la nueva contraseña si se proporciona
        if (password) {
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(password, salt);
        }

        await usuario.save();

        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            user: usuario,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Elimina un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Elimina el usuario por ID
        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Usuario eliminado correctamente',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
