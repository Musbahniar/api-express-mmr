const mdlRegis = require('../models/registrasi');
const myResponse = require('../utils/myResponse');

exports.findAll = async (req, res) => {
  try {
    const regis = await mdlRegis.Regis.find({});
    res.status(200).send({
      status: 200,
      message: 'success',
      payload: regis,
      pager: {}
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'errro',
      payload: error,
      pager: {}
    })
  }
}

exports.findAllByNoregistrasi = async (req, res) => {
  try {
    const regis = await mdlRegis.Regis.find({ noRegistrasi: req.params.noreg }).exec();
    res.status(200).send({
      status: 200,
      message: 'success',
      payload: regis,
      pager: {}
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'errro',
      payload: error,
      pager: {}
    })
  }
}

exports.findAllByGedung = async (req, res) => {
  try {
    const regis = await mdlRegis.Regis.find({ idGedung: req.params.idgedung }).exec();
    res.status(200).send({
      status: 200,
      message: 'success',
      payload: regis,
      pager: {}
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'error',
      payload: error,
      pager: {}
    })
  }
}

exports.findAllByGedungTingkatSekolah = async (req, res) => {
  try {
    // const regis = await mdlRegis.Regis
    //               .find({ idGedung: req.params.idgedung }, { "idSekolahKelas": { "$elemMatch": { "id": 28 } } })
    //               .select('noRegistrasi namaLengkap').exec();

    const regis = await mdlRegis.Regis.find({$and: [{idGedung: req.params.idgedung}, {"idSekolahKelas": { "$elemMatch": { "id": req.params.tk } }}]}).exec();
    res.status(200).send({
      status: 200,
      message: 'success',
      payload: regis,
      pager: {}
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'error',
      payload: error,
      pager: {}
    })
  }
}

exports.resetDevice = async (req, res) => { 
  const query = { noRegistrasi: req.body.noreg};
  try {
    const regis = await mdlRegis.Regis.findOneAndUpdate(query, {imei: ''}, {new: true}).exec();
    if(regis) {
      res.status(200).send({
        status: 200,
        message: 'success',
        payload: "Reset device berhasil",
        pager: {}
      })
    } else {
      res.status(200).send({
        status: 200,
        message: 'success',
        payload: "No registrasi tidak ditemukan",
        pager: {}
      })
    }
    
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'error',
      payload: error,
      pager: {}
    })
  }
}

exports.addSiswa = async (req, res) => {
  const regis = dbRegis.Regis(req.body);

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
  // console.log(hasil);
  if(hasil.status === 'oke') {
    delete hasil.status;
    mdlRegis.Regis.init()
      .then (async () => {
        const regis = mdlRegis.Regis(hasil);
        await regis.save();
        res.status(200).send({
          status: 200,
          message: 'success',
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

exports.resetBundling = async (req, res) => {
  // console.log(req.body);
  res.status(200).send({
    status: 200,
    message: 'oke',
    pager: {}
  })
}

exports.getAllMySQL = async (req, res) => {
  const hasil = await mdlRegis.modelGetAllMySQL();
  myResponse.createResponse(res,hasil.status === 'err' ? 500 : 200,hasil.status === 'err' ? 'error' : 'success',hasil.databalik,{});
}