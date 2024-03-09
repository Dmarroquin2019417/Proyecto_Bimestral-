import Producto from '../producto/products.model.js';
import Appointment from "../appointment/appointment.model.js";
import Categoria from '../categoria/category.model.js'; 

const categoriaPredeterminadaId = '...';

export const agregarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidadDisponible, categoria } = req.body;

        // Verifica si se proporciona una categoría
        let categoriaProducto = categoria;
        if (!categoria) {
            // Si no se proporciona una categoría, asigna la categoría predeterminada
            categoriaProducto = categoriaPredeterminadaId;
        }

        // Crea un nuevo producto con la categoría asignada
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            cantidadDisponible,
            categoria: categoriaProducto 
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

export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, cantidadDisponible, categoria } = req.body;

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
        producto.categoria = categoria; // Asigna el nuevo valor de la categoría

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

export const buscarProductosPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;

        // Buscar productos que coincidan con el nombre
        const productos = await Producto.find({ nombre: { $regex: new RegExp(nombre, "i") } });

        res.status(200).json({ productos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Explorar las categorías existentes
export const explorarCategorias = async (req, res) => {
    try {
        // Obtener categorías únicas de los productos
        const categorias = await Categoria.find(); // Consulta todas las categorías disponibles

        res.status(200).json({ categorias });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Acceder al catálogo de productos filtrado por categoría
export const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;

        // Buscar productos por categoría
        const productos = await Producto.find({ categoria });

        res.status(200).json({ productos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};