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

        //** 

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

/* 
  Con el metodo verif de jsonwebtoken comprobamos que el token que pasamos este bien generoado, para ello
  primero pasamos el token que extraemos de los header de la petición y luego la firma que tenemos en la variables de entorno

  Esto nos devuelve un paylod y de este extraemos el nombre del usuario y el rol
*/