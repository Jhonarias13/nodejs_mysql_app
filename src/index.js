const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

// Initializations 
const app = express();

// Settings
app.set('port', process.env.PORT || 4000); // definir unpuerto, si existe un puerto tomalo , si no usa el 4000
app.set('views', path.join(__dirname, 'views')); // le dice a node que la cparte views esta ahi

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layaoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    exntname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');

// Widdlwares: son funciones que se ejecutan cada vez que un cliente envia una peticion al servidor
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // me permite enviar y recibir json desde otra aplicacion cliente

// Global variables
app.use((req, res, next) => {
    next();
})

// Routes definir la URLS
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


// Public: carpetas que el naveghador puede acceder

app.use(express.static(path.join(__dirname, 'public')));

// Startinig Server
app.listen(app.get('port'), () => {
    console.log('server on port:', app.get('port'));

});