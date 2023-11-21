const dotenv = require('dotenv');
const mysql = require('mysql');
const { log } = require('mercedlogger');
const util = require('util');
dotenv.config({
  path: './config.env'
});

const poolDefault = mysql.createPool({
  host            : process.env.default_DATABASE_HOST,
  user            : process.env.default_DATABASE_USER, 
  password        : process.env.default_DATABASE_PASSWORD, 
  database        : process.env.default_DATABASE_NAME,
  port            : process.env.default_DATABASE_PORT,
  connectionLimit : 15
});
poolDefault.getConnection((err, connDefault) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      log.red('Database connection was Close');
    }
    if(err.code === 'ER_CON_COUNT_ERROR') {
      log.red('Database has too many Connections');
    }
    if(err.code === 'ECONNREFUSED') {
      log.red('Database connection was refused');
    }
    if(connDefault) connDefault.release();
    return
  }
})
poolDefault.query = util.promisify(poolDefault.query);
module.exports =  poolDefault ;