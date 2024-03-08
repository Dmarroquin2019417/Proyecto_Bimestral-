'use strict';

import Categoria from '../categoria/category.model.js';

// Controlador para agregar una nueva categoría
export const agregarCategoria = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { nombre, descripcion } = req.body;
        
        // Crear una nueva instancia de Categoria con los datos
        const nuevaCategoria = new Categoria({ nombre, descripcion });

        // Guardar la categoría en la base de datos
        await nuevaCategoria.save();

        // Responder con la categoría guardada
        res.status(200).json({
            categoria: nuevaCategoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para obtener la lista de todas las categorías
export const obtenerCategorias = async (req, res) => {
    try {
        // Obtener todas las categorías
        const categorias = await Categoria.find();

        // Responder con la lista de categorías
        res.status(200).json({ categorias });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para obtener una categoría por su ID
export const obtenerCategoriaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la categoría por su ID
        const categoria = await Categoria.findById(id);

        // Verificar si la categoría existe
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Responder con la categoría encontrada
        res.status(200).json({ categoria });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para actualizar una categoría por su ID
export const actualizarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener los datos actualizados del cuerpo de la solicitud
        const { nombre, descripcion } = req.body;

        // Buscar y actualizar la categoría por su ID
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });

        // Verificar si la categoría existe
        if (!categoriaActualizada) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Responder con la categoría actualizada
        res.status(200).json({ categoria: categoriaActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para eliminar una categoría por su ID
export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar la categoría por su ID
        await Categoria.findByIdAndDelete(id);

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
