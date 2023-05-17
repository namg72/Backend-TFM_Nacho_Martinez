const jwt = require('jsonwebtoken');

const crearJWT = (userName, rol) => {

    return new Promise((res, rej) => {

        const payload = {
            userName: userName,
            rol: rol
        }

        jwt.sign(payload, process.env.JWT, {
                expiresIn: '24h'
            },

            (err, token) => {
                if (err) {
                    rej("No se ha podido generar el token")
                } else {
                    res(token)
                }
            }
        )
    })

}


module.exports = { crearJWT };