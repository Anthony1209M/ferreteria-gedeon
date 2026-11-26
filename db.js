const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER || 'localhost',
    database: 'FerreteriaGedeon',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Esto es en caso de que se use instancia nombrada tipo SQLEXPRESS
if (process.env.DB_INSTANCE) {
    config.options.instanceName = process.env.DB_INSTANCE;
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('conectado a sql server');
        return pool;
    })
    .catch(err => {
        console.log('error al conectar con la bd:', err.message);
    });

module.exports = { sql, poolPromise };