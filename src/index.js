const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// Initializations 
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000); // definir un puerto, si existe un puerto tomalo , si no usa el 4000
app.set('views', path.join(__dirname, 'views')); // le dice a node que la cparte views esta ahi

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');


// Widdlwares: son funciones que se ejecutan cada vez que un cliente envia una peticion al servidor
app.use(session({
    secret: 'mysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash()); // para enviar mensajes
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // me permite enviar y recibir json desde otra aplicacion cliente
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

// Routes definir la URLS
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


// Public: carpetas que el navegador puede acceder

app.use(express.static(path.join(__dirname, 'public')));

// Startinig Server
app.listen(app.get('port'), () => {
    console.log('server on port:', app.get('port'));

});