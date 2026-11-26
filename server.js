const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PUERTO = 3000;

app.use(express.json());
app.use(session({
    secret: 'gedeon-clave-secreta',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.listen(PUERTO, () => {
    console.log('servidor corriendo en http://localhost:' + PUERTO);
});