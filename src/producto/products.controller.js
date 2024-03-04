import Producto from '../producto/products.model.js';

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

// Obtiene los productos agotados
export const obtenerProductosAgotados = async (req, res) => {
    try {
        // Busca los productos con cantidad disponible igual a cero
        const productosAgotados = await Producto.find({ cantidadDisponible: 0 });

        if (productosAgotados.length === 0) {
            return res.status(200).json({ message: 'No hay productos agotados en este momento' });
        }

        res.status(200).json({
            productosAgotados,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const obtenerProductosMasVendidos = async (req, res) => {
    try {
        // Supongamos que tenemos una colección de ventas que registra las ventas de cada producto
        const ventas = await Venta.aggregate([
            { $group: { _id: "$producto", totalVendido: { $sum: "$cantidad" } } },
            { $sort: { totalVendido: -1 } },
            { $limit: 10 } // Limitamos a los 10 productos más vendidos
        ]);

        const productosMasVendidos = await Producto.populate(ventas, { path: '_id', select: 'nombre descripcion' });

        res.status(200).json({
            productosMasVendidos,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
