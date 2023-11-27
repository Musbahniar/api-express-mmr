const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const esm = require('express-status-monitor');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

// const apicache = require('apicache');

dotenv.config({path: './config.env'});
// cache = apicache.middleware;

const app = express();

// Allow Cross-Origin Requests
app.use(
  cors({
    origin: JSON.parse(process.env.origin),
    credentials: true
  })
);

// Membatasi akses API dengan IP yang sama
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Request from this IP, please trt again in an hour',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Membatasi parameter dari body untuk req.body
app.use(express.json({
  limit: '30kb'
}));

// Cegah penyusup dgn XSS dari HTML Code
app.use(xss());

// Cache semua permintaan routes dalam waktu 5menit
// app.use(cache('5 minutes'));

// Prevent parameter pollution
app.use(hpp());
app.use(helmet());

// express status monitor (http://ip:port/status)
app.use(esm());

// Create Login a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('combined'));

// Routes
app.use('/', require ('./src/routes/index'));

module.exports = app;


