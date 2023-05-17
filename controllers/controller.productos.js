const { ResultWithContext } = require('express-validator/src/chain');
const conexion = require('../DBConfig/databaseConfig');



const controllerProductos = {};


// Productos totales 
controllerProductos.productos = ((req, res) => {

    let query = "SELECT * FROM productos"

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
        res.status(500).json({ msg: "!! Ha ocurrido un error" })

    }
});



// Productos totales  por tipo
controllerProductos.productosTipo = ((req, res) => {
    const { tipoProducto } = req.body;

    try {

        let query = `SELECT * FROM productos WHERE tipoProducto = ?`;
        conexion.query(query, [tipoProducto], (err, rows) => {

            if (err) throw err;

            if (rows.length == 0)
                res.send(`No hay productos de ${tipoProducto}`)
            else
                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }

});


// Productos por familia
controllerProductos.productosFamilia = ((req, res) => {
    const { familia } = req.body;
    try {

        let query = `SELECT * FROM productos WHERE familia = ?`;
        conexion.query(query, [familia], (err, rows) => {

            if (err) throw err;

            if (rows.length == 0)
                res.send(`No hay productos de ${familia}`)
            else
                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }
});


// Productos por subfamilia
controllerProductos.productosSubFamilia = ((req, res) => {
    const { subfamilia } = req.body;
    try {

        let query = `SELECT * FROM productos WHERE subfamilia = ? order by nombreProducto`;
        conexion.query(query, [subfamilia], (err, rows) => {

            if (err) throw err;

            if (rows.length == 0)
                res.status(404).json({ msg: `Actualmente no disponemos de productos del tipo: '${subfamilia}'` })
            else
                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }
});

// Productos por nombreProduto 
controllerProductos.productosNombre = ((req, res) => {
    const { nombreProducto } = req.body;
    const sig = "%"
    const search = sig + nombreProducto + sig


    try {

        let query = `SELECT * FROM productos WHERE nombreProducto like "${search}" order by nombreProducto`;
        conexion.query(query, (err, rows) => {



            if (err) throw err;

            if (rows.length == 0) {
                res.status(404)
                res.json({ msg: `No hay productos de ${nombreProducto}` })
            } else

                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }

});

// Productos por nombreProduto que empeizen
controllerProductos.productosNombrePor = ((req, res) => {
    const { nombreProducto } = req.body;
    const sig = "%"
    const search = nombreProducto + sig


    try {

        let query = `SELECT * FROM productos WHERE nombreProducto like "${search}" order by nombreProducto`;
        conexion.query(query, (err, rows) => {



            if (err) throw err;

            if (rows.length == 0) {
                res.status(404)
                res.json({ msg: `No hay productos de ${nombreProducto}` })
            } else

                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }

});




// Buscar prodcuto por nombre dentro de un tipo
controllerProductos.productosTipoYNombre = ((req, res) => {

    const { tipoProducto, nombreProducto } = req.body;
    const sig = "%"
    const search = sig + nombreProducto + sig


    try {

        let query = `SELECT * FROM productos WHERE tipoProducto= "${tipoProducto}" and nombreProducto like "${search}"`;
        conexion.query(query, (err, rows) => {



            if (err) throw err;

            if (rows.length == 0) {
                res.status(404)
                res.json({ msg: `No hay productos de ${nombreProducto}` })
            } else
                res.send(rows)

        })


    } catch (error) {
        throw error
        res.status(500).json({ msg: "!! Ha ocurrido un error" })
    }
});



// INSERTAR PRODUCTOS

controllerProductos.productosInsert = ((req, res) => {

    let query = 'SELECT * FROM productos WHERE nombreProducto=?'

    const { tipoProducto, familia, subfamilia, codigoBarras, nombreProducto, precioCompra, precioVenta } = req.body
    const IvaCompra = (precioCompra * 0.21).toFixed(2)
    const VentaConIva = (precioVenta * 1.21).toFixed(2)

    try {

        conexion.query(query, [nombreProducto], (err, rows) => {
            if (err) throw err;

            if (rows.length === 0) {

                query = "insert into productos (tipoProducto, familia, subfamilia, codigoBarras, nombreProducto, precioCompra, ivaCompra, precioVenta, precioVentaIva) values (?,?,?,?,?,?,?,?,?);"

                conexion.query(query, [tipoProducto, familia, subfamilia, codigoBarras, nombreProducto, precioCompra, IvaCompra, precioVenta, VentaConIva], (err, rows) => {
                    if (err) throw err

                    res.json({
                        msg: ` ${nombreProducto} insertado correctamente`
                    })

                })

            } else {
                res.status(400)
                res.json({
                    msg: ` Ya existe un procuto con ese nombre`
                })
            }

        })



    } catch (err) {
        throw err

        res.status(500).json({ msg: "!! Ha ocurrido un error y no se ha insertado el producto" })

    }
})





module.exports = controllerProductos