import Appointment from "../appointment/appointment.model.js";
import Product from "../producto/products.model.js";
import Factura from "./factura/factura.model.js";

export const agregarAlCarrito = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.usuario._id;

    // Verificar la disponibilidad del producto
    const producto = await Product.findById(productId);
    if (!producto) {
      return res.status(404).json({ message: "El producto no está disponible" });
    }

    // Verificar si ya existe una cita para el usuario y producto
    const existAppointment = await Appointment.findOne({
      user: userId,
      producto: productId,
    });


    // Crear una nueva cita en el carrito de compras
    const nuevaCita = new Appointment({
      status: 'COMPLETED', // Puedes ajustar el estado según tus necesidades
      producto: productId,
      user: userId,
    });

    await nuevaCita.save();

    res.status(201).json({ message: "Producto agregado al carrito correctamente", cita: nuevaCita, producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "El producto no existe en nuestro catalogo", error });
  }
};

import mongoose from 'mongoose';

export const procesoDeCompra = async (req, res) => {
  try {
      const userId = req.usuario._id;
      const citasEnCarrito = await Appointment.find({ user: userId, status: 'COMPLETED' });

      if (citasEnCarrito.length === 0) {
          return res.status(400).json({ message: "No tienes productos en tu carrito de compras" });
      }

      let totalCompra = 0;
      const productosEnFactura = [];

      for (const cita of citasEnCarrito) {
          const producto = await Product.findById(cita.producto);
          if (producto) {
              totalCompra += producto.precio;
              productosEnFactura.push({ nombre: producto.nombre, precio: producto.precio });
          }
      }

      const facturaId = new mongoose.Types.ObjectId();
      await Appointment.updateMany(
          { user: userId, status: 'COMPLETED' },
          { status: 'PURCHASED', facturaId: facturaId }
      );

      const factura = new Factura({
          facturaId: facturaId,
          usuario: userId,
          productos: productosEnFactura,
          total: totalCompra
      });

      await factura.save();

      res.status(200).json({ message: "Proceso de compra completado con éxito", factura });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al completar el proceso de compra", error });
  }
};

export const obtenerHistorialCompras = async (req, res) => {
  try {
        const userId = req.usuario._id;

        // Obtener todas las citas completadas del usuario
        const citasCompletadas = await Appointment.find({ user: userId, status: 'PURCHASED' })
            .populate('user')
            .populate('producto');

        // Mapear las citas completadas a un formato que incluya el nombre del usuario y del producto
        const historialCompras = citasCompletadas.map(cita => ({
            producto: cita.producto.nombre, // Nombre del producto
            cantidad: cita.cantidad,
            fecha: cita.fecha,
            usuario: cita.user.nombre // Nombre del usuario
        }));

        res.status(200).json({ historialCompras });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para editar una factura
export const editarFactura = async (req, res) => {
  try {
    const facturaId = req.params.facturaId;
    const { nuevosProductos } = req.body;

    // Verificar si la factura existe
    const factura = await Factura.findById(facturaId);
    if (!factura) {
      return res.status(404).json({ message: "La factura no fue encontrada" });
    }

    // Verificar si los productos son válidos
    const productosValidos = await Promise.all(
      nuevosProductos.map(async productoId => {
        const producto = await Product.findById(productoId);
        return producto ? producto : null;
      })
    );

    // Filtrar productos válidos y actualizar la factura
    const productosFiltrados = productosValidos.filter(producto => producto !== null);
    factura.productos = productosFiltrados;

    // Guardar la factura actualizada
    await factura.save();

    res.status(200).json({ message: "Factura editada correctamente", factura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar la factura", error });
  }
};

// Controlador para obtener las facturas asociadas a un usuario específico
export const obtenerFacturasUsuario = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar todas las facturas del usuario
    const facturas = await Factura.find({ usuario: userId });

    res.status(200).json({ facturas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas del usuario", error });
  }
};

export const obtenerProductosFactura = async (req, res) => {
  try {
    const facturaId = req.params.facturaId;

    // Buscar la factura por su ID
    const factura = await Factura.findById(facturaId);

    // Verificar si la factura existe
    if (!factura) {
      return res.status(404).json({ message: "La factura no fue encontrada" });
    }

    // Obtener los detalles de los productos asociados a esta factura
    const productos = factura.productos;

    res.status(200).json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos de la factura", error });
  }
};