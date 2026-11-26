const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

// lista todos los productos
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .query('SELECT id, codigo, nombre, categoria, precio, stock FROM Productos ORDER BY nombre');

        res.json(resultado.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'No se pudieron cargar los productos' });
    }
});

module.exports = router;