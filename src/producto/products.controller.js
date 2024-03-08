import Producto from '../producto/products.model.js';
import Appointment from "../appointment/appointment.model.js";

// Agrega un nuevo producto a la base de datos
export const agregarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidadDisponible } = req.body;

        // Crea un nuevo producto
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            cantidadDisponible
        });

        // Guarda el producto en la base de datos
        await nuevoProducto.save();

        res.status(201).json({
            message: "Producto creado correctamente",
            producto: nuevoProducto,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtiene la lista de todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();

        res.status(200).json({
            productos,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtiene un producto por su ID
export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            producto,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualiza los detalles de un producto por su ID
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, cantidadDisponible } = req.body;

        // Busca el producto por su ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualiza los detalles del producto
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.cantidadDisponible = cantidadDisponible;

        await producto.save();

        res.status(200).json({
            message: 'Producto actualizado correctamente',
            producto,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Elimina un producto por su ID
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        // Elimina el producto por su ID
        await Producto.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Producto eliminado correctamente',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const identificarProductosAgotados = async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await Producto.find();

        // Filtrar productos agotados
        const productosAgotados = productos.filter(producto => producto.cantidadDisponible === 0);

        res.status(200).json({ productosAgotados });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProductosMasVendidos = async (req, res) => {
    try {
        const productosMasVendidos = await Appointment.aggregate([
            { $match: { status: 'PURCHASED' } }, // Filtrar citas compradas
            {
                $group: {
                    _id: "$producto",
                    cantidadVendida: { $sum: 1 }
                }
            }, // Contar ventas por producto
            { $sort: { cantidadVendida: -1 } }, // Ordenar por cantidad de ventas descendente
            { $limit: 10 } // Obtener solo los 10 productos más vendidos, puedes ajustar este límite según tus necesidades
        ]);

        // Obtener los detalles de los productos más vendidos
        const detallesProductosMasVendidos = [];
        for (const producto of productosMasVendidos) {
            const detallesProducto = await Producto.findById(producto._id);
            detallesProductosMasVendidos.push({
                producto: detallesProducto,
                cantidadVendida: producto.cantidadVendida
            });
        }

        res.status(200).json({ productosMasVendidos: detallesProductosMasVendidos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos más vendidos", message: error.message });
    }
};