const mdlRegis = require('../models/registrasi');
const myResponse = require('../utils/myResponse');

exports.findAll = async (req, res) => {
  try {
    // const regis = await Regis.find({});
    const regis = await mdlRegis.Regis.find({});
    res.status(200).send({
      status: 'success',
      data: regis
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: error
    })
  }
}

exports.addSiswa = async (req, res) => {
  const regis = mdlRegis.Regis(req.body);

  try {
    await regis.save();
    res.status(200).send({
      status: 'success',
      data: regis
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: error
    })
  }
  
}

exports.topicRegis = async (req, res) => {
  const hasil = await mdlRegis.modelTopicRegis(req.body);
  if(hasil.status === 'oke') {
    delete hasil.status;
    mdlRegis.Regis.init()
      .then (async () => {
        const regis = mdlRegis.Regis(hasil);
        await regis.save();
        res.status(200).send({
          status: 200,
          message: 'success',
          // payload: hasil,
          payload: regis,
          pager: {}
        })
      })
      .catch ((err) => {
        res.status(500).send({
          status: 500,
          message: 'errro',
          payload: err,
          pager: {}
        })
      })
  } else {
    myResponse.createResponse(res,500,'error',hasil.databalik,{});
  }
}

exports.getAllMySQL = async (req, res) => {
  const hasil = await mdlRegis.modelGetAllMySQL();
  myResponse.createResponse(res,hasil.status === 'err' ? 500 : 200,hasil.status === 'err' ? 'error' : 'success',hasil.databalik,{});
}