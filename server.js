const express = require('express');
const path = require('path');

const app = express();
const PUERTO = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.listen(PUERTO, () => {
    console.log('servidor corriendo en http://localhost:' + PUERTO);
});