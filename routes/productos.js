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

// Esto agrega un producto nuevo
router.post('/', async (req, res) => {
    const { codigo, nombre, categoria, precio, stock } = req.body;

    if (!codigo || !nombre || precio === undefined || precio === '') {
        return res.status(400).json({ mensaje: 'Código, nombre y precio son obligatorios' });
    }

    if (isNaN(precio) || Number(precio) < 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor o igual a 0' });
    }

    const stockFinal = (stock === undefined || stock === '') ? 0 : Number(stock);

    if (!Number.isInteger(stockFinal) || stockFinal < 0) {
        return res.status(400).json({ mensaje: 'El stock debe ser un número entero mayor o igual a 0' });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('codigo', sql.VarChar, codigo.trim())
            .input('nombre', sql.VarChar, nombre.trim())
            .input('categoria', sql.VarChar, categoria ? categoria.trim() : null)
            .input('precio', sql.Decimal(10, 2), Number(precio))
            .input('stock', sql.Int, stockFinal)
            .query(`INSERT INTO Productos (codigo, nombre, categoria, precio, stock)
                    VALUES (@codigo, @nombre, @categoria, @precio, @stock)`);

        res.status(201).json({ mensaje: 'Producto agregado' });
    } catch (error) {
        // 2627 y 2601 son los errores de sql server por valor duplicado
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
        }
        console.log(error);
        res.status(500).json({ mensaje: 'No se pudo guardar el producto' });
    }
});

module.exports = router;

