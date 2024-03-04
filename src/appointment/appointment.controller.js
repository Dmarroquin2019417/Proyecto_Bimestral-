import Appointment from "../appointment/appointment.model.js";
import Product from "../producto/products.model.js"; // Importa el modelo de productos
import { format } from "date-fns";

export const agregarAlCarrito = async (req, res) => {
  try {
    const { date, productId } = req.body;
    const userId = req.usuario._id;

    // Convertir la cadena de fecha a formato ISO 8601
    const isoDate = new Date(date);

    // Verificar la disponibilidad del producto
    const producto = await Product.findById(productId);
    if (!producto) {
      return res.status(404).json({ message: "El producto no está disponible" });
    }

    // Verificar si ya existe una cita para el usuario y producto en la misma fecha
    const existAppointment = await Appointment.findOne({
      user: userId,
      producto: productId,
      date: isoDate,
    });

    if (existAppointment) {
      return res.status(400).json({ message: "Ya tienes una cita para este producto en esta fecha" });
    }

    // Crear una nueva cita en el carrito de compras
    const nuevaCita = new Appointment({
      date: isoDate,
      status: 'COMPLETED', // Puedes ajustar el estado según tus necesidades
      producto: productId,
      user: userId,
    });

    await nuevaCita.save();

    res.status(201).json({ message: "Producto agregado al carrito correctamente", cita: nuevaCita, producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el producto al carrito", error });
  }
};
