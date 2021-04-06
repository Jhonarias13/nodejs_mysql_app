const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys'); // importacion de la configruacion de la base de datos
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASES HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection) connection.release();
    console.log('DATABASE IS CONNECTED');
    return;
});

// promisify pool query
pool.query = promisify(pool.query);
module.exports = pool;