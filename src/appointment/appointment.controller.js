import Appointment from "../appointment/appointment.model.js";
import Product from "../producto/products.model.js";

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

export const procesoDeCompra = async (req, res) => {
  try {
    const userId = req.usuario._id;

    // Verificar si existen citas en el carrito de compras para el usuario
    const citasEnCarrito = await Appointment.find({ user: userId, status: 'COMPLETED' });

    // Verificar si hay citas en el carrito de compras
    if (citasEnCarrito.length === 0) {
      return res.status(400).json({ message: "No tienes productos en tu carrito de compras" });
    }

    // Calcular el total de la compra sumando el precio de cada producto en el carrito
    let totalCompra = 0;
    const productosEnFactura = [];
    for (const cita of citasEnCarrito) {
      const producto = await Product.findById(cita.producto);
      if (producto) {
        totalCompra += producto.precio;
        productosEnFactura.push({ nombre: producto.nombre, precio: producto.precio });
      }
    }

    // Realizar la transacción de pago (aquí podrías integrar una pasarela de pago, etc.)

    // Marcar las citas en el carrito como compradas
    await Appointment.updateMany({ user: userId, status: 'COMPLETED' }, { status: 'PURCHASED' });

    // Generar la factura detallada
    const factura = {
      usuario: userId,
      productos: productosEnFactura,
      total: totalCompra,
      fecha: new Date(),
    };

    // Puedes guardar la factura en la base de datos si es necesario

    // Responder con la factura detallada
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
