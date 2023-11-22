const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { log } = require('mercedlogger');

dotenv.config({
  path: './config.env'
});

const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const MONGO_ENDPOINT = `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin&readPreference=primary&ssl=false&directConnection=true`;

mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${password}@${MONGO_ENDPOINT}`);
mongoose.pluralize(null);
mongoose.connection
.on('open', () => log.green('DATABASE STATE', 'Connection Contabo Open'))
.on('close', () => log.magenta('DATABASE STATE', 'Connection Contabo Close'))
.on('error', (error) => log.red('DATABASE STATE Contabo', error))

module.exports = mongoose