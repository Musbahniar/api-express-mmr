const dotenv = require('dotenv');
const authBasic = require('basic-auth');
dotenv.config({
  path: './config.env'
});

const bearerAuth = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
  if(token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if(token === process.env.tokenBearer ) {
    next();
  } else {
    return res.status(403).json ({
      success: false,
      message: 'Authorization token has not been supplied'
    })
  }
};

const basicAuth = (req, res, next) => {
  let user = authBasic(req);
  
  if(user.name === process.env.userNameBasic && user.pass === process.env.passwordBasic) {
    next();
  } else {
    return res.status(403).json ({
      success: false,
      message: 'Authorization token has not been supplied'
    })
  }
};

module.exports = { bearerAuth, basicAuth };