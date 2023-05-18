// objeto controller
const controllerUser = {};

// importaqos conexion de la base de datos
const conexion = require('../DBConfig/databaseConfig');

// importamos el express-validator
const { validationResult } = require("express-validator");

// Paquete de encriptacion
const bcrypt = require('bcryptjs');

// Importamos el helper para crear token
const { crearJWT } = require('../helpers/jwt.helper')
const jwt = require('jsonwebtoken');

// Mostramos  usuario
controllerUser.user = ((req, res) => {

    let query = "SELECT * FROM user"

    try {

        conexion.query(query, (err, rows) => {
            if (err) {
                throw err;
                console.log(err);
            } else {
                res.send(rows)
            }
        })

    } catch (error) {
        res.send(res.statusCode + 'Error de servidor')
        console.log(err);

    }
});


// Insertarmos usuario en la bd
controllerUser.insertUser = ((req, res) => {

    // Validamos los datos que nos bienen en el body
    const validator = validationResult(req);
    if (validator.errors.length > 0) {
        res.status(400).json(validator.errors)
        return;
    }

    // Datos extraidos del body de la peticion
    const { userName, email, password } = req.body;


    //validamos que no haya mail repetido

    try {


        let query = 'SELECT * FROM user WHERE email=?'

        conexion.query(query, [email], (err, rows) => {
            if (err) throw err;

            if (rows.length == 0) {

                query = "INSERT INTO user (userName, email, password) VALUES(?, ?, ?)";

                //Encriptamos la contraseña antes de enviarla
                const salt = bcrypt.genSaltSync();
                const securePassword = bcrypt.hashSync(password, salt);

                conexion.query(query, [userName, email, securePassword], (err, rows) => {
                    if (err) {
                        throw err;

                    } else {
                        res.status(200).json({
                            ok: true,
                            userName: userName,
                            email: email,
                            msg: `Usuario insertado correctamente`
                        })
                    }
                })

            } else {
                res.status(404).json({
                    ok: false,
                    msg: `Ya existe un usuario con el mail: ${email}`
                })
            }

        })
    } catch (err) {
        res.send(res.statusCode + 'Error de servidor')
        console.log(err);

    }
});

// Actualizar contraseña
controllerUser.updatePassword = ((req, res) => {

    // Datos extraidos del body
    const { password, idUser } = req.body;

    try {

        let query = 'SELECT * FROM user WHERE idUser=?'
        conexion.query(query, [idUser], (err, rows) => {
            if (err) throw err;

            if (rows.length == 1) {

                query = "UPDATE user SET  password = ? WHERE idUser = ?";

                conexion.query(query, [password, idUser], (err, rows) => {
                    if (err) {
                        throw err;
                        console.log(err);
                    } else {

                        res.status(200).json({ msg: 'Contraseña modificada correctamente' })

                    }
                })
            } else {
                res.status(404).json({ msg: `No exite ningun usurio con id ${idUser}` })

            }
        })

    } catch (err) {
        res.send(res.statusCode + 'Error de servidor')
        console.log(err);

    }
});

// borrar usuario
controllerUser.deleteUser = ((req, res) => {
    // Datos extraidos del body
    const { idUser } = req.body;

    try {
        let query = 'SELECT * FROM user WHERE idUser=?'
        conexion.query(query, [idUser], (err, rows) => {
            if (err) throw err;

            if (rows.length == 1) {

                query = "DELETE FROM user WHERE idUser= ?";

                conexion.query(query, [idUser], (err, rows) => {
                    if (err)
                        throw err;

                    res.status(200).json({ msg: 'Usuario  eliminado de la base de datos ' })


                })

            } else {
                res.status(404).json({ msg: `No exite ningun usurio con id ${idUser}` })
            }
        })

    } catch (err) {
        res.send(res.statusCode + 'Error de servidor')
        console.log(err);
    }

});


//Login usuario
controllerUser.login = ((req, res) => {

    // Validamos los datos que nos bienen en el body
    const validator = validationResult(req);
    if (validator.errors.length > 0) {
        res.status(400).json(validator.errors)

        return;
    }

    const { email, password } = req.body;

    try {
        let query = "SELECT * FROM user WHERE email=? ";
        conexion.query(query, [email], (err, rows) => {
            if (err) throw err;

            if (rows != 0) {

                const { userName, rol } = rows[0]

                let admin = false

                const validPassword = bcrypt.compareSync(password, rows[0]['password']);

                if (validPassword) {
                    if (rol === 'admin') {
                        admin = true
                    }

                    //Creamos el token  
                    crearJWT(userName, rol)
                        .then((token) => {
                            res.json({
                                ok: true,
                                msg: `Bienvenido ${rows[0].userName}`,
                                userName: rows[0].userName,
                                rol: `${rows[0].rol}`,
                                admin: admin,
                                token
                            });
                        })
                        .catch((err) => {
                            res.json({
                                msg: err

                            })

                        })
                } else {
                    res.status(404).json({
                        ok: false,
                        msg: `Nombre de usuario o contraseña incorrecto`
                    })
                }
            } else {

                res.status(404).json({
                    ok: false,
                    msg: `Nombre de usuario o contraseña incorrecto`
                })
            }
        })

    } catch (error) {
        res.send("!!Ha ocurrido un Error")
    }
})

// VALIDAR EL TOKEN
controllerUser.renewToken = async(req, res = response) => {

    const { userName, rol } = req

    let admin = false

    if (rol === 'admin') {
        admin = true
    }

    //generamos un nuevo jwt
    const token = await crearJWT(userName, rol)


    return res.json({
        ok: true,
        username: userName,
        rol: rol,
        token: token,
        admin: admin
    })

}

module.exports = controllerUser;