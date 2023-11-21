exports.show = (req, res) => {
  res.status(200).send ({
    message: 'Routing Check Bearer Auth OKE !!!'
  })
}

exports.showGrup = (req, res) => {
  res.status(200).send({
    message: "Routing Check Token OKE On GROUP!!!"
  });
}