const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {


    //capturamos el token de los headers
    const token = req.header('x-token');

    //Si no hay token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token',

        })
    }

    try {


        const { userName, rol } = jwt.verify(token, process.env.JWT)

        req.userName = userName,
            req.rol = rol

    } catch (error) {
        console.log(token);
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'

        })

    }



    //todo ok
    next();
}

module.exports = {
    validarJWT
}