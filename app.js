// requerimos e iniciamos express
const express = require('express');
const app = express();

// requerimos la conexion
const conexion = require('./DBConfig/databaseConfig')


// variables de entornos
require('dotenv').config();

//Requerimos las cors
const cors = require("cors");
app.use(cors());




// importamos las rutas
const userRouter = require('./routes/user.Router');
const productosRouter = require('./routes/productos.Router');

// MIDDLEWARES
app.use(express.json());


// Rutas
app.use(userRouter);
app.use(productosRouter);


// escuchamos la conexion de la bd

app.listen(process.env.SERVER_PORT, () => {
    console.log(`servidor escuchando en localhost:${process.env.SERVER_PORT}`);
})