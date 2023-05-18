// requerimos express y su metodo router
const express = require('express');
const router = express.Router();

// Controllers
const { productos, productosTipo, productosFamilia, productosSubFamilia, productosNombre, productosNombrePor, productosTipoYNombre, productosInsert } = require('../controllers/controller.productos');

//Rutas productos
router.get("/productos", productos)
router.post("/productos/tipo", productosTipo)
router.post("/productos/familia", productosFamilia)
router.post("/productos/subfamilia", productosSubFamilia)
router.post("/productos/nombre", productosNombre)
router.post("/productos/nombrePor", productosNombrePor)
router.post("/productos/tipo/nombre", productosTipoYNombre)
router.post("/productos/insert", productosInsert)


//exportamos la rutas
module.exports = router;