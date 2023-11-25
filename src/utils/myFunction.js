const jmlHariDuaTanggal = (tglawal, tglakhir) => {
  var tglawal = dateFormat(tglawal);
  var tglakhir = dateFormat(tglakhir);

  let date1Split = tglawal.sqldate.split('-');
  let date2Split = tglakhir.sqldate.split('-');

  let newdate1 = new Date(date1Split[0], date1Split[1], date1Split[2]);
  let newdate2 = new Date(date2Split[0], date2Split[1], date2Split[2]);

  date1_unixtime = parseInt(newdate1.getTime() / 1000);
  date2_unixtime = parseInt(newdate2.getTime() / 1000);

  let timeDifference = date2_unixtime - date1_unixtime;
  let timeDifferenceInHours = timeDifference / 60 / 60;
  let timeDifferenceInDays = timeDifferenceInHours  / 24;

  
  return timeDifferenceInDays;
}

const dateFormat = (date) => {
  var date_ob = new Date();
  if (date !== undefined) date_ob = new Date(date);

  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();
  return {
      sqldate: year + "-" + month + "-" + date,
      sqldatetime: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
      sqltime: hours + ":" + minutes + ":" + seconds,
      datetimefilename: [year, month, date, hours, minutes, seconds].join(""),
      filename: [year, month, date].join(""),
      ind: [date, month, year].join("/"),
  }
}

module.exports = {jmlHariDuaTanggal, dateFormat}