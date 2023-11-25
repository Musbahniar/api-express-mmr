const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const esm = require('express-status-monitor');
const morgan = require('morgan');

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
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Request from this IP, please trt again in an hour'
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

// Logging
// app.use(morgan('dev'));
// hanya menampilkan kode yang error 
morgan('combined', { skip: function (req, res) { return res.statusCode < 400 } })
app.use(morgan('combined'));

app.use('/', require ('./src/routes/index'));

module.exports = app;


