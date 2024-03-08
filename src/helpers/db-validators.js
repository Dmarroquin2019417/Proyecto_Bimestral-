// Importar modelos necesarios
import Role from '../role/role.model.js';
import User from '../user/user.model.js';

// Función para validar si un role existe en la base de datos
export const esRoleValido = async (role = '') => {
    // Buscar el role en la base de datos
    const existeRol = await Role.findOne({ role });

    // Si el role no existe, lanzar un error
    if (!existeRol) {
        throw new Error(`El role ${role} no existe en la base de datos`);
    }
}

// Función para validar si un correo electrónico ya está registrado
export const existenteEmail = async (correo = '') => {
    // Buscar el usuario por correo electrónico
    const existeEmail = await User.findOne({ correo });

    // Si el correo ya está registrado, lanzar un error
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}

// Función para validar si un usuario existe por su ID
export const existeUsuarioById = async (id = '') => {
    // Buscar el usuario por su ID
    const existeUsuario = await User.findById(id);

    // Si el usuario no existe, lanzar un error
    if (!existeUsuario) {
        throw new Error(`El ID: ${id} No existe`);
    }
}
