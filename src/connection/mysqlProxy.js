const dotenv = require('dotenv');
const mysql = require('mysql');
const { log } = require('mercedlogger');
const util = require('util');
dotenv.config({
  path: './config.env'
});

const poolProxy28 = mysql.createPool({
  host            : process.env.proxy28_DATABASE_HOST,
  user            : process.env.proxy28_DATABASE_USER, 
  password        : process.env.proxy28_DATABASE_PASSWORD, 
  database        : process.env.proxy28_DATABASE_NAME,
  port            : process.env.proxy28_DATABASE_PORT,
  connectionLimit : 15,
});
poolProxy28.getConnection((err, connProxy) => {
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
    if(connProxy) connProxy.release();
    return
  }
})
poolProxy28.query = util.promisify(poolProxy28.query);
module.exports =  poolProxy28 ;