// const dotenv = require('dotenv');
const { log } = require('mercedlogger');
const {Schema, model} = require('../connection/mongoAtlasCon');
const myFungsi = require('../utils/myFunction');
// const {Schema, model} = require('../connection/mongoContabo');
// const myResponse = require('../utils/myResponse');

// connDefault = require('../connection/mysqlDefault');
// connProxy = require('../connection/mysqlProxy');
connNode = require('../connection/mysqlNode');

const ProdukdiBeli = new Schema ({
  _id: false,
  c_IdBundling: {type: Number},
  c_IdJenisProduk: {type: Number},
  c_IdKomponenProduk: {type: Number},
  c_IdSekolahKelas: {type: Number},
  c_NamaBundling: {type: String},
  c_NamaJenisProduk: {type: String},
  c_NamaProduk: {type: String},
  c_TanggalAkhir: {type: String},
  c_TanggalAwal: {type: String}
})

const TargetPengerjaanMapel = new Schema ({
  _id: false,
  cidmapel: {type: Number},
  targetharian: {type: Number},
  targetmingguan: {type: Number},
  targetbulanan: {type: Number}
})

const RegisSchema = new Schema ({
  daftarProduk: [ProdukdiBeli],
  Databaru: {type: String},
  email: {type: String},
  emailOrtu: {type: String},
  idGedung: {type: Number},
  idKelas: [{_id: false, id: {type: Number},namaKelas: {type: String}}],
  idKota: {type: Number},
  idSekolahKelas: [{_id: false, id: {type: Number},namaSekolahKelas: {type: String}}],
  imei: {type: String},
  jenisKelas: {type: String},
  jobOrtu: {type: String},
  kirimOTP: {type: String},
  lastLogin: {type: String},
  namaGedung: {type: String},
  namaKota: {type: String},
  namaLengkap: {type: String, required: true},
  namaSekolah: {type: String},
  nomorHp: {type: String, unique: true, index: true},
  nomorHpOrtu: {type: String},
  noRegistrasi: {type: String, required: true, unique: true, index: true},
  pilihanPTN: {type: String},
  siapa: {type: String, required: true},
  statusBayar: {type: String},
  tahunAjaran: {type: String},
  targetPerKelompokUji: {type: String},
  targetPerMapel: [TargetPengerjaanMapel],
  targetSoal: {type: String},
  tokenJWT: {type: String},
  waktu: {type: String}
})

const Regis = model("register_siswa", RegisSchema)


//-------------- MODEL FOR mySQL Database -------------------------------------------------------------------
modelTopicRegis = async (data) => {
  try {
    const idPembelian = data.id
    var [record] = await connNode.query(`
                    SELECT 
                    cs.c_IdBundling,
                    cs.c_TanggalDaftar,
                    'gokasir' AS Databaru,
                    JSON_UNQUOTE(JSON_EXTRACT(cs.c_InfoKontak,'$.EMAIL')) AS email,
                    JSON_UNQUOTE(JSON_EXTRACT(cs.c_InfoKontak,'$.EMAIL2')) AS emailOrtu,
                    cs.c_IdGedung AS idGedung,
                    cs.c_IdPenanda AS idKota,
                    cs.c_IdKelas AS idKelas,
                    cs.c_NamaKelas AS namaKelas,
                    cs.c_IdSekolahKelas AS idSekolahKelas,
                    cs.c_TingkatSekolahKelas AS namaSekolahKelas,
                    '-' AS imei,
                    cs.c_JenisKelas AS jenisKelas,
                    bio.c_PekerjaanOrtu AS jobOrtu,
                    '-' AS kirimOTP,
                    '' AS lastLogin,
                    cs.c_NamaGedung AS namaGedung,
                    cs.c_NamaLengkap AS namaLengkap,
                    cs.c_NamaSekolah AS namaSekolah,
                    JSON_UNQUOTE(JSON_EXTRACT(cs.c_InfoKontak,'$.HP')) AS nomorHp,
                    JSON_UNQUOTE(JSON_EXTRACT(cs.c_InfoKontak,'$.HP2')) AS nomorHpOrtu,
                    cs.c_NoRegistrasi AS noRegistrasi,
                    '' AS pilihanPTN,
                    'SISWA' AS siapa,
                    cs.c_StatusBayar AS statusBayar,
                    cs.c_TahunAjaran AS tahunAjaran,
                    jt.c_JumlahSoal AS targetSoal,
                    '' AS tokenJWT,
                    NOW() AS waktu
                    FROM t_Cluster_Siswa cs 
                    LEFT JOIN t_Biodata bio ON cs.c_NoRegistrasi = bio.c_NoRegistrasi
                    LEFT JOIN t_JumlahTarget jt ON cs.c_IdSekolahKelas = jt.c_IdSekolahKelas AND cs.c_TahunAjaran = jt.c_TahunAjaran
                    WHERE c_IdPembelian = ?`,[idPembelian]);
  } catch (err) {
    log.yellow(`Error occurred: `, err.message);
    return hasilAkhir = {status: 'err', databalik: err.message};
  }
  
  if(record) {
    const promiseBundel = queryBundel(record.c_IdBundling);
    const promiseTP = queryTahunAjaran('2023/2024');
    const promiseTargetMapel = queryTargetMapel('2023/2024', record.idSekolahKelas);
    const promises = [promiseTP, promiseTargetMapel, promiseBundel];
    try {
      const result = await Promise.all(promises);
      const c_akhir = JSON.parse(JSON.stringify(result[0]));
      const jmlHari = myFungsi.jmlHariDuaTanggal(record.c_TanggalDaftar, c_akhir[0].c_akhir);
      const hasilTargetMapel = JSON.parse(JSON.stringify(result[1]));
      const targetHarianAll = (record.targetSoal/jmlHari);
      
      let targetHitung = [];
      hasilTargetMapel.map((obj, i) => {
        targetHitung.push ({
          'cidmapel' : obj.cIdKelompokUjian,
          'persen': obj.cPersen,
          'targetharian' : (targetHarianAll * (obj.cPersen/100)).toFixed(),
          'targetmingguan' : (targetHarianAll * (obj.cPersen/100) * 7).toFixed(),
          'targetbulanan' : (targetHarianAll * (obj.cPersen/100) * 30).toFixed()
        });
      })
      return hasil = {
        status: 'oke',
        daftarProduk: JSON.parse(JSON.stringify(result[2])),
        Databaru: 'gokasir',
        email: record.email,
        emailOrtu: record.emailOrtu,
        idGedung: record.idGedung,
        idKelas: [{id: record.idKelas, namaKelas: record.namaKelas}],
        idKota: record.idKota,
        idSekolahKelas: [{id: record.idSekolahKelas, namaSekolahKelas: record.namaSekolahKelas}],
        imei: record.imei,
        jenisKelas: record.jenisKelas,
        joOrtu: record.jobOrtu,
        kirimOTP: record.kirimOTP,
        lastLogin: record.lastLogin,
        namaGedung: record.namaGedung,
        namaKota: record.namaKota,
        namaLengkap: record.namaLengkap,
        namaSekolah: record.namaSekolah,
        nomorHp: record.nomorHp,
        nomorHpOrtu: record.nomorHpOrtu,
        noRegistrasi: record.noRegistrasi,
        pilihanPTN: record.pilihanPTN,
        siapa: record.siapa,
        statusBayar: record.statusBayar,
        tahunAjaran: record.tahunAjaran,
        targetPerKelompokUji: '',
        targetPerMapel: targetHitung,
        targetSoal: record.targetSoal,
        tokenJWT: record.tokenJWT,
        waktu: myFungsi.dateFormat(record.waktu).sqldatetime
      }
    } catch {error} {
      log.yellow(`Error occurred: `, error.message);
    }
  } else {
    return hasil ={
      status: 'err',
      databalik: 'Data Pembelian tidak ada'
    }
  }
}

queryBundel = (idBundling) => {
  return new Promise ((resolve, reject) => {
    connNode.query(`
                SELECT
                a.c_IdBundling,
                c.c_IdJenisProduk,
                b.c_IdProduk AS c_IdKomponenProduk,
                c.c_IdSekolahKelas,
                bl.c_NamaBundling,
                d.c_NamaJenisProduk,
                c.c_NamaProduk,
                a.c_TanggalPemberian AS c_TanggalAwal,
                a.c_TanggalAkhirPemberian AS c_TanggalAkhir
                FROM db_GOIconsV2.t_Bundling bl
                LEFT JOIN db_GOIconsV2.t_DetailHargaBundling a ON bl.c_IdBundling = a.c_IdBundling
                LEFT JOIN db_GOIconsV2.t_PemberlakuanProduk b ON a.c_IdPemberlakuan = b.c_IdPemberlakuan
                LEFT JOIN db_GOIconsV2.t_Produk c ON b.c_IdProduk = c.c_IdProduk
                LEFT JOIN db_GOIconsV2.t_MKT_JenisProduk d ON c.c_IdJenisProduk = d.c_idJenisProduk
                WHERE a.c_IdBundling = ? AND b.c_Status = ?`,[idBundling, 'Disetujui'], (error, results) => {
                  if (error) {
                    return reject(error);
                  } else {
                    return resolve(results);
                  }
    });
  });
};

queryTahunAjaran = (tahunAjaran) => {
  return new Promise((resolve, reject) => {
    connNode.query(`SELECT c_akhir FROM db_GOIconsV2.t_TahunAjaran WHERE c_TahunAjaran = ?`,[tahunAjaran], (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    })
  })
}

queryTargetMapel = (tahunAjaran, idSekolahKelas) => {
  return new Promise((resolve, reject) => {
    connNode.query(`
              SELECT cIdKelompokUjian,SUM(cPersen) AS cPersen
              FROM db_GOKreasi.t_TargetMapel tm 
              WHERE cIdSekolahKelas = ? AND cTahunAjaran = ?
              GROUP BY cIdKelompokUjian`,[idSekolahKelas, tahunAjaran], (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    })
  })
}

module.exports = {Regis, modelTopicRegis, queryBundel}