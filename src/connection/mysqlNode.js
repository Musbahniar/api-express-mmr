const dotenv = require('dotenv');
const mysql = require('mysql');
const { log } = require('mercedlogger');
const util = require('util');
dotenv.config({
  path: './config.env'
});

const poolNode193 = mysql.createPool({
  host            : process.env.node193_DATABASE_HOST,
  user            : process.env.node193_DATABASE_USER, 
  password        : process.env.node193_DATABASE_PASSWORD, 
  database        : process.env.node193_DATABASE_NAME,
  port            : process.env.node193_DATABASE_PORT,
  connectionLimit : 15,
});
poolNode193.getConnection((err, connNode) => {
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
    if(connNode) {
      log.cyan('Database release');
      connNode.release();
      return
    }
  }
})
poolNode193.query = util.promisify(poolNode193.query);
module.exports =  poolNode193 ;