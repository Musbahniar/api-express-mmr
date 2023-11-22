// const {Schema, model} = require('../connection/mongoAtlasCon');
const {Schema, model} = require('../connection/mongoContabo');
const { log } = require('mercedlogger');
const myResponse = require('../utils/myResponse');

connDefault = require('../connection/mysqlDefault');
connProxy = require('../connection/mysqlProxy');

const ProdukdiBeli = new Schema ({
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
  cidmapel: {type: Number},
  targetharian: {type: Number},
  targetmingguan: {type: Number},
  targetbulanan: {type: Number}
})

const RegisSchema = new Schema ({
  c_Statusbayar: {type: String},
  daftarProduk: [ProdukdiBeli],
  Databaru: {type: String},
  email: {type: String},
  emailOrtu: {type: String},
  idGedung: {type: Number},
  idKelas: {id: {type: Number},namaKelas: {type: String}},
  idKota: {type: Number},
  idKota: {type: Number},
  idSekolahKelas: {id: {type: Number},namaSekolahKelas: {type: String}},
  imei: {type: String},
  jenisKelas: {type: String},
  jobOrtu: {type: String},
  kirimOTP: {type: String},
  lastLogin: {type: String},
  namaGedung: {type: String},
  namaKota: {type: String},
  namaLengkap: {type: String, required: true},
  namaSekolah: {type: String},
  nomorHp: {type: String},
  nomorHpOrtu: {type: String},
  noRegistrasi: {type: String, required: true, unique: true},
  pilihanPTN: {type: String},
  siapa: {type: String, required: true, unique: true},
  statusBayar: {type: String},
  tahunAjaran: {type: String},
  targetPerKelompokUji: {type: String},
  targetPerMapel: [TargetPengerjaanMapel],
  targetsoal: {type: String},
  tokenJWT: {type: String},
  wakttu: {type: String}
})

const Regis = model("register_siswa", RegisSchema)


//-------------- MODEL FOR mySQL Database ---------------------------
modelTopicRegis = async (data) => {
  try {
    const idPembelian = data.id
    var [record] = await connProxy.query(`
                    SELECT c_NoRegistrasi AS cNoRegistrasi,c_NamaLengkap AS cNamaLengkap,'SISWA' AS cSiapa,c_IdBundling,
                    JSON_UNQUOTE(JSON_EXTRACT(c_InfoKontak,'$.HP')) AS cNomorHP
                    FROM db_GOIconsV2.t_Cluster_Siswa WHERE c_IdPembelian = ?`, [idPembelian]);
  } catch (err) {
    log.yellow(`Error occurred: `, err.message);
    return hasilAkhir = {status: 'err', databalik: err.message};
  }
    
  try {
    const paketBundels = await connProxy.query(`
                        SELECT
                        b.c_IdProduk AS cIdProduk,
                        a.c_IdBundling AS cIdBundling,
                        c.c_NamaProduk AS cNamaProduk,
                        c.c_IdJenisProduk AS cIdJenisProduk,
                        d.c_NamaJenisProduk AS cNamaJenisProduk,
                        #a.c_TanggalPemberian,
                        #a.c_TanggalAkhirPemberian,
                        IF(b.c_Status = 'Disetujui' AND c.c_Status = "Disetujui","Aktif","TidakAktif") AS cStatus,
                        c.c_IdKurikulum AS cIdKurikulum,
                        e.c_NamaKurikulum AS cNamaKurikulum
                        FROM db_GOIconsV2.t_DetailHargaBundling a
                        LEFT JOIN db_GOIconsV2.t_PemberlakuanProduk b ON a.c_IdPemberlakuan = b.c_IdPemberlakuan
                        LEFT JOIN db_GOIconsV2.t_Produk c ON b.c_IdProduk = c.c_IdProduk
                        LEFT JOIN db_GOIconsV2.t_MKT_JenisProduk d ON c.c_IdJenisProduk = d.c_idJenisProduk
                        LEFT JOIN db_banksoalV2.t_Kurikulum e ON c.c_IdKurikulum = e.c_IdKurikulum
                        WHERE a.c_IdBundling = ?`,[record.c_IdBundling]); 
    return hasil =  {
      status: 'oke',
      cNoRegistrasi: record.cNoRegistrasi,
      cNamaLengkap: record.cNamaLengkap,
      cSiapa: record.cSiapa,
      cImei: ' ',
      cNomorHP: record.cNomorHP,
      produkdibeli: paketBundels
    }
  } catch (err2) {
    log.yellow(`Error occurred: `, err2.message);
    return hasilAkhir = {status: 'err', databalik: err2.message};
  }
  // delete record.c_IdBundling;
}

modelGetAllMySQL = async () => {
  try {
    var kueri = `SELECT cNoRegister,cIdsekolahkelas FROM t_peringkatnew_20231022 LIMIT 10`;
    const hasilKueri = await connDefault.query(kueri);
    return hasilAkhir = {status: 'oke', databalik: hasilKueri};
  } catch (err) {
    log.yellow(`Error occurred: `, err.message);
    return hasilAkhir = {status: 'err', databalik: err.message};
  }
}

module.exports = {Regis, modelTopicRegis, modelGetAllMySQL}