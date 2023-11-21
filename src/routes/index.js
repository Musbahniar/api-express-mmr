var app = require('express');
var router = app.Router();
const { bearerAuth, basicAuth } = require('../middlewares/auth');
const validator = require('../validation/index');
require('express-group-routes');
 
const checkRoute = require('../controllers/check');
const regisRoute = require('../controllers/registrasi');

const apicache = require('apicache');
cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200
const cacheSuccess = cache('5 minutes', onlyStatus200);

router.get('/checkApiBearer',[bearerAuth], checkRoute.show);
router.get('/checkApiBasic',[basicAuth], checkRoute.show);

router.get('/regisall',[bearerAuth], regisRoute.findAll);
router.post('/addsiswa',[bearerAuth], regisRoute.addSiswa);

router.post('/topicRegistrasi',[bearerAuth, validator.validateTopicRegistrasi, validator.checkValidationResult], regisRoute.topicRegis);


router.get('/getmysql',[bearerAuth], regisRoute.getAllMySQL);
router.get('/getvalidasi',[
  bearerAuth,
  validator.validateContoh,
  validator.checkValidationResult,
  cacheSuccess
  ], regisRoute.getAllMySQL
);

router.group('/api/v1', (router) => {
  router.get('/checkApiBasic',[basicAuth], checkRoute.showGrup);
});


// -----------------------------Routing Not Found 404--------------------------------------------------------------------------------------------------------
router.get('/', function (req, res){
  res.json({
    status: 200,
    message: 'success',
    payload: 'Server API GO Running....',
    pager: {}
  })
});

router.all('*', function (req, res){
  res.json({
    status: 400,
    message: 'error',
    payload: 'Route Not Found .....',
    pager: {}
  })
});

module.exports = router;