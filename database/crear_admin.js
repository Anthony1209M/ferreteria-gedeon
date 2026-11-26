const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db');

async function crearAdmin() {
    const hash = await bcrypt.hash('admin123', 10);
    const pool = await poolPromise;

    await pool.request()
        .input('usuario', sql.VarChar, 'admin')
        .input('clave', sql.VarChar, hash)
        .input('nombre', sql.VarChar, 'Administrador')
        .query('INSERT INTO Usuarios (usuario, clave, nombre) VALUES (@usuario, @clave, @nombre)');

    console.log('usuario admin creado');
    process.exit();
}

crearAdmin();