import {response} from '../res/response.js'
import pkg from "pg";
const { Pool } = pkg;

import qrcode from 'qrcode-terminal';
import whatsappWeb from 'whatsapp-web.js';
const { Client, LocalAuth } = whatsappWeb;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
});

whatsappClient.on('qr', (qr) => {
  // Tampilkan QR code di terminal untuk dipindai
  qrcode.generate(qr, { small: true });
  console.log('Silakan scan QR code di atas dengan WhatsApp Anda.');
});

whatsappClient.on('ready', () => {
  console.log('Client WhatsApp siap digunakan!');
});

// Inisialisasi client WhatsApp
whatsappClient.initialize();

function sendWhatsAppMessage(phoneNumber, message) {
  // Normalisasi nomor telepon
  const normalizedNumber = normalizePhoneNumber(phoneNumber);

  // Format nomor telepon untuk WhatsApp (tambahkan '@c.us')
  const whatsappNumber = normalizedNumber + '@c.us';

  whatsappClient.sendMessage(whatsappNumber, message)
    .then((response) => {
      console.log(`Pesan berhasil dikirim ke ${phoneNumber}`);
    })
    .catch((err) => {
      console.error(`Gagal mengirim pesan ke ${phoneNumber}:`, err);
    });
}




export const konfigurasiAlat = async (req, res) => {
    try {
        console.log("Menerima permintaan GET /alat");
        const result = await pool.query(
          "SELECT * FROM konfigurasi"
        );
        console.log("Data alat berhasil diambil:", result.rows);
        res.json(result.rows);
      } catch (err) {
        console.error("Error di GET /alat:", err);
        response(500, "invalid", "error", err);
      }
}

export const konfigurasiAlatid = async (req, res)=> {
    try{
        const id_sewa = req.params.id_sewa
        const sql = `SELECT * FROM konfigurasi WHERE id_sewa = $1`
        const result = await pool.query(sql, [id_sewa])
        if(result.rows.length > 0){
            response(200, result.rows, `alat by id_sewa = '${id_sewa}'`, res)
        }else{
            response(404, null, `alat with id_sewa = '${id_sewa}' not found`, res)
        }
    }catch(err){
        response(500, "invalid", "error", res);
    }
}

export const updateKonfigurasi = async (req, res) => {
    try {
      const { id_sewa } = req.params;
      let { labelalat, suhubawah, suhuatas, targetpemasangan, tanggalpemasangan, urlgambar, status_alarm, namapenerima, nomorwa } = req.body;
  
      // Validasi input
      if (!labelalat || !suhubawah || !suhuatas || !targetpemasangan || !tanggalpemasangan) {
        return response(400, null, "Data konfigurasi tidak lengkap", res);
      }
  
      if (parseFloat(suhuatas) <= parseFloat(suhubawah)) {
        return response(400, null, "Suhu atas harus lebih besar dari suhu bawah", res);
      }
  
      if (status_alarm === "aktif") {
        if (!namapenerima || !nomorwa) {
          return response(400, null, "Nama penerima dan nomor WA harus diisi jika alarm aktif", res);
        }
      } else {
        // Jika alarm tidak aktif, set namapenerima dan nomorwa ke null
        namapenerima = null;
        nomorwa = null;
      }
  
      let gambarURL = urlgambar;
  
      if (urlgambar && !urlgambar.startsWith("http")) {
        gambarURL = `${req.protocol}://${req.get("host")}/public/images/${urlgambar}`;
      }
  
      // Logging data yang akan dikirim ke database
      console.log('Parameter query:', [labelalat, suhubawah, suhuatas, targetpemasangan, tanggalpemasangan, gambarURL, status_alarm, namapenerima, nomorwa, id_sewa]);
  
      const sql = `UPDATE konfigurasi SET labelalat = $1, suhubawah = $2, suhuatas = $3, targetpemasangan = $4, tanggalpemasangan = $5, urlgambar = $6, status_alarm = $7, namapenerima = $8, nomorwa = $9 WHERE id_sewa = $10 RETURNING *`;
  
      const result = await pool.query(sql, [labelalat, suhubawah, suhuatas, targetpemasangan, tanggalpemasangan, gambarURL, status_alarm, namapenerima, nomorwa, id_sewa]);
  
      if (result.rowCount) {
        const data = {
          isSuccess: result.rowCount,
          message: "Update Data Successfully",
          data: result.rows[0]
        };
        response(200, data, "Update Data is Successfully", res);
    
        // Jika alarm aktif, kirim pesan WhatsApp kepada penerima
        if (status_alarm === "aktif" && nomorwa) {
          const message = `Halo ${namapenerima}, alarm telah diaktifkan untuk alat ${labelalat} dengan ID Sewa ${id_sewa}.`;
          sendWhatsAppMessage(nomorwa, message);
        }
      } else {
        response(404, null, `Konfigurasi dengan id_sewa = ${id_sewa} tidak ditemukan`, res);
      }
    } catch (err) {
      console.error("Error updating konfigurasi:", err);
      response(500, null, `Error updating konfigurasi: ${err.message}`, res);
    }
    //tes
  }
  
  

export const postPerjalanan = async (req, res) => {
    try {
      const id_sewa = req.params.id_sewa;
      const { nomorkendaraan, jenis_kendaraan } = req.body;
  
      if (!id_sewa || !nomorkendaraan || !jenis_kendaraan) {
        return response(400, null, 'Data tidak lengkap', res);
      }
  
      const sql = `
        INSERT INTO perjalanan (id_sewa, id_konfigurasi, nomorkendaraan, jenis_kendaraan)
        SELECT k.id_sewa, k.id_konfigurasi, $1, $2
        FROM konfigurasi k
        WHERE k.id_sewa = $3
        RETURNING *;
      `;
  
      const result = await pool.query(sql, [nomorkendaraan, jenis_kendaraan, id_sewa]);
  
      if (result.rows.length > 0) {
        response(201, result.rows[0], 'Data berhasil ditambahkan ke tabel perjalanan', res);
      } else {
        response(404, null, `Tidak ditemukan konfigurasi dengan id_sewa = '${id_sewa}'`, res);
      }
    } catch (err) {
      console.error(err);
      response(500, null, 'Terjadi kesalahan pada server', res);
    }
  };
  

export const postColdStorage = async (req, res) => {
    try {
        const id_sewa = req.params.id_sewa;

        const { namapemilik, latitude, longitude, alamat, kapasitas } = req.body;

        if (!id_sewa || !namapemilik || !latitude || !longitude || !alamat || !kapasitas) {
            return response(400, null, 'Data tidak lengkap', res);
        }

        if (isNaN(latitude) || isNaN(longitude) || isNaN(kapasitas)) {
            return response(400, null, 'Latitude, longitude, dan kapasitas harus berupa angka', res);
        }

        const sql = `
            INSERT INTO cold_storage (id_sewa, id_konfigurasi, namapemilik, latitude, longitude, alamat, kapasitas)
            SELECT k.id_sewa, k.id_konfigurasi, $1, $2, $3, $4, $5
            FROM konfigurasi k
            WHERE k.id_sewa = $6
            RETURNING *;
        `;

        const result = await pool.query(sql, [namapemilik, latitude, longitude, alamat, kapasitas, id_sewa]);

        if (result.rows.length > 0) {
            response(201, result.rows[0], 'Data berhasil ditambahkan ke tabel cold_storage', res);
        } else {
            response(404, null, `Tidak ditemukan konfigurasi dengan id_sewa = '${id_sewa}'`, res);
        }
    } catch (err) {
        console.error(err);
        response(500, null, 'Terjadi kesalahan pada server', res);
    }
};

export const updateSuhuAlat = async (req, res) => {
  try {
    const { imei, suhu } = req.body;

    // Perbarui suhu di tabel 'alat'
    await pool.query('UPDATE alat SET suhu = $1 WHERE imei = $2', [suhu, imei]);

    // Dapatkan konfigurasi terkait yang memiliki alarm aktif
    const configResult = await pool.query(
      `SELECT k.*, s.id_sewa FROM konfigurasi k
       JOIN sewa s ON k.id_sewa = s.id_sewa
       WHERE s.imei = $1 AND k.status_alarm = 'aktif'`,
      [imei]
    );

    if (configResult.rows.length > 0) {
      const config = configResult.rows[0];
      const suhuAtas = parseFloat(config.suhuatas);
      const suhuBawah = parseFloat(config.suhubawah);
      const nomorwa = config.nomorwa;
      const namapenerima = config.namapenerima;
      const labelalat = config.labelalat;
      const id_sewa = config.id_sewa;
      const alarmSent = config.alarm_sent;

      const isOutOfBounds = suhu > suhuAtas || suhu < suhuBawah;

      if (isOutOfBounds && !alarmSent) {
        // Suhu melebihi batas dan alarm belum dikirim
        const message = `Peringatan! Suhu alat ${labelalat} (ID Sewa: ${id_sewa}) telah melebihi batas. Suhu saat ini: ${suhu}°C.`;
        sendWhatsAppMessage(nomorwa, message);

        // Perbarui status alarm
        await pool.query('UPDATE konfigurasi SET alarm_sent = TRUE WHERE id_konfigurasi = $1', [config.id_konfigurasi]);
      } else if (!isOutOfBounds && alarmSent) {
        // Suhu kembali normal dan alarm pernah dikirim
        const message = `Informasi: Suhu alat ${labelalat} (ID Sewa: ${id_sewa}) telah kembali normal (${suhu}°C).`;
        sendWhatsAppMessage(nomorwa, message);

        // Reset status alarm
        await pool.query('UPDATE konfigurasi SET alarm_sent = FALSE WHERE id_konfigurasi = $1', [config.id_konfigurasi]);
      }
    }

    res.status(200).json({ message: 'Suhu berhasil diperbarui dan dicek.' });
  } catch (err) {
    console.error('Error saat memperbarui suhu:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui suhu.' });
  }
};

function normalizePhoneNumber(phoneNumber) {
  // Hapus semua karakter non-digit
  let normalizedNumber = phoneNumber.replace(/\D/g, '');

  // Jika nomor dimulai dengan '0', ganti dengan '62'
  if (normalizedNumber.startsWith('0')) {
    normalizedNumber = '62' + normalizedNumber.slice(1);
  }


  return normalizedNumber;
}


