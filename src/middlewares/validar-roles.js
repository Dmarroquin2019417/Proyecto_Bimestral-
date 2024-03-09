// Middleware para verificar si el usuario tiene alguno de los roles proporcionados
export const tieneRole = (...roles) => {
    return (req, res, next) => {
        // Verificar si existe información del usuario en el token
        if (!req.usuario) {
            // Responder con un código 500 si no se ha validado el token
            return res.status(500).json({
                msg: 'Se quiere verificar un role sin validar el token primero'
            });
        }

        // Verificar si el rol del usuario está incluido en los roles permitidos
        if (!roles.includes(req.usuario.role)) {
            // Responder con un código 401 si el usuario no tiene un rol autorizado
            return res.status(401).json({
                msg: `Usuario no autorizado, posee un role ${req.usuario.role}, los roles autorizados son ${roles}`
            });
        }

        // Pasar al siguiente middleware si el usuario tiene un rol autorizado
        next();
    };
};
