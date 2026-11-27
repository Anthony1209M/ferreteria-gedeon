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

// edita un producto que ya existe
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { codigo, nombre, categoria, precio, stock } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: 'Id de producto no válido' });
    }

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
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('codigo', sql.VarChar, codigo.trim())
            .input('nombre', sql.VarChar, nombre.trim())
            .input('categoria', sql.VarChar, categoria ? categoria.trim() : null)
            .input('precio', sql.Decimal(10, 2), Number(precio))
            .input('stock', sql.Int, stockFinal)
            .query(`UPDATE Productos
                    SET codigo = @codigo, nombre = @nombre, categoria = @categoria,
                        precio = @precio, stock = @stock
                    WHERE id = @id`);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto' });
        }

        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
        }
        console.log(error);
        res.status(500).json({ mensaje: 'No se pudo actualizar el producto' });
    }
});

// elimina un producto
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: 'Id de producto no válido' });
    }

    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Productos WHERE id = @id');

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto' });
        }

        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'No se pudo eliminar el producto' });
    }
});

module.exports = router;

