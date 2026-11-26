const express = require('express');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ mensaje: 'Completa el usuario y la contraseña' });
    }

    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query('SELECT * FROM Usuarios WHERE usuario = @usuario');

        if (resultado.recordset.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const user = resultado.recordset[0];
        const coincide = await bcrypt.compare(clave, user.clave);

        if (!coincide) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        req.session.usuario = { id: user.id, nombre: user.nombre };
        res.json({ mensaje: 'ok' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ mensaje: 'sesion cerrada' });
});

module.exports = router;