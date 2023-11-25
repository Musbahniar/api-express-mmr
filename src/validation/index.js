const {check, validationResult} = require('express-validator');
const myResponse = require('../utils/myResponse');

module.exports.checkValidationResult = checkValidationResult;
function checkValidationResult(req,res,next) {
  var result = validationResult(req);
  if(!result.isEmpty()) {
    myResponse.createResponse(res, 400, 'error', result.array()[0].msg, {});
  } else {
    next();
  }
}

module.exports.validateContoh = [
  check('email').isLength({min:1}).withMessage('Email Wajib Diisi').isEmail().withMessage('Alamat email salah'),
  check('password').isLength({min:1}).withMessage('Password wajib diisi'),
  check('umur').isNumeric().withMessage('Umur harus angka')
]

module.exports.validateTopicRegistrasi = [
  check('id').isLength({min: 1}).withMessage('Id tidak ada')
]

module.exports.validateNoRegistrasi = [
  check('noreg').isLength({min: 1}).withMessage('No Registrasi tidak ada')
]

module.exports.validateResetBundling = [
  check('noreg').isLength({min: 1}).withMessage('No Registrasi tidak ada'),
  check('idbundling').isLength({min: 1}).withMessage('ID Bundling tidak ada')
]

