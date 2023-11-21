const dotenv = require('dotenv');
const {log} = require('mercedlogger');

dotenv.config({
  path: './config.env'
});

process.on('uncaughtException', err => {
  log.red('UNCAUGHT EXCEPTION!!! shutting down...')
  log.red(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

// Start the server
const port = process.env.portNode;
app.listen(port, () => {
    // console.log(`Application is running on port ${port}`);
    log.green(`Application is running on port ${port}`)
});

process.on('unhandledRejection', err => {
  log.red('UNHANDLED REJECTION!!!  shutting down ...');
  log.red(err.name, err.message);
  // server.close(() => {
      process.exit(1);
  // });
});