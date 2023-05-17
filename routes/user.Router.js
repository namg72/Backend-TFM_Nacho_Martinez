// requerimos express y su metodo router
const express = require("express");
const router = express.Router();

// requerimos el metodo check del paquete express-validator;
const { check } = require('express-validator')

// importamos los controladores
const { user, insertUser, updatePassword, deleteUser, login, renewToken } = require('../controllers/controller.User');

//middleware
const { validarJWT } = require("../middlewares/validar-jwt");


// Rutas
router.get("/user", user)

router.post("/user/insert", [
    check('userName', "El nombre de Usuario es obligatorio").not().isEmpty(),
    check('email', "El email es obligatorio").not().isEmpty(),
    check('email', "formato de email no valido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("password", "La contraseña tiene que entre 6 y 12 caracteres").isLength({ min: 6, max: 12 }),
    check("password", "La contraseña tiene que ser Alfanumerica").isAlphanumeric()
], insertUser)

router.delete("/user/delete", deleteUser)

router.put("/user/update", updatePassword)

router.post('/user/login', [
        check("email", "El email es obligatorio").not().isEmpty(),
        check("email", "El email no tiene formato valido").isEmail(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        check("password", "email o contraseña incorrecta").isLength({ min: 6, max: 12 }),
        check("password", "La contraseña tiene que ser Alfanumerica").isAlphanumeric()
    ],
    login)

router.get('/user/renew', validarJWT, renewToken)

// exportamos la rutas
module.exports = router;