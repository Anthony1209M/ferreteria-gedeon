const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');

const app = express();
const PUERTO = 3000;

app.use(express.json());
app.use(session({
    secret: 'gedeon-clave-secreta',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/auth', authRoutes);

// la api de productos solo para usuarios con sesion
function protegerApi(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.status(401).json({ mensaje: 'Debes iniciar sesion' });
    }
}

app.use('/api/productos', protegerApi, productosRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

function soloLogueados(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

app.get('/inventario', soloLogueados, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inventario.html'));
});

app.listen(PUERTO, () => {
    console.log('servidor corriendo en http://localhost:' + PUERTO);
});