// almacena o se usa para guardar las rutas principales de la app, rutas para contacto, acerca de, o de bienvenida

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;