const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { log } = require('mercedlogger');

const usernameAtlas = "pakeuntukdaftar";
const passwordAtlas = "vL753SVUqDNuA4uI";
const clusterAtlas = "cluster0";
const dbnameAtlas = "kreasi";

mongoose.connect(
  `mongodb+srv://${usernameAtlas}:${passwordAtlas}@${clusterAtlas}.i3gqsiv.mongodb.net/${dbnameAtlas}?retryWrites=true&w=majority`,
  {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true
  }
);

mongoose.pluralize(null);
mongoose.connection
.on('open', () => log.green('DATABASE STATE', 'Connection Atlas Open'))
.on('close', () => log.magenta('DATABASE STATE', 'Connection Atlas Close'))
.on('error', (error) => log.red('DATABASE STATE Atlas', error))

module.exports = mongoose