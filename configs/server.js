'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import productsRoutes from '../src/producto/products.routes.js';
import categoryRoutes from '../src/categoria/category.routes.js';
import agregarAlCarritoRoutes  from '../src/appointment/appointment.routes.js'; 

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/gestion/v1/users';
        this.authPath = '/gestion/v1/auth';
        this.productsPath = '/gestion/v1/products';
        this.categoryPath = '/gestion/v1/category';
        this.carritoPath = '/gestion/v1/carrito'; 

        this.middlewares();  // Configura los middleware de la aplicación
        this.conectarDB();  // Establece la conexión a la base de datos
        this.routes();  // Configura las rutas de la aplicación
    }

    // Conecta a la base de datos MongoDB
    async conectarDB() {
        await dbConnection();
    }

    // Configura los middleware de la aplicación
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    // Configura las rutas de la aplicación
    routes() {
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.productsPath, productsRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.carritoPath, agregarAlCarritoRoutes); // Agrega la ruta para agregar productos al carrito
    }

    // Inicia el servidor y escucha en el puerto especificado
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;
