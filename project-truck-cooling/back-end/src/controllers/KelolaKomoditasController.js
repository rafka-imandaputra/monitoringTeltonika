import {response} from '../res/response.js'
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

export const getKelolaKomoditas = async (req, res) => {
    try {
        console.log("Menerima permintaan GET /commodity");
        const result = await pool.query(
          "SELECT * FROM commodity"
        );
        console.log("Data barang berhasil diambil:", result.rows);
        res.json(result.rows);
      } catch (err) {
        console.error("Error di GET /commodity:", err);
        response(500, "invalid", "error", err);
      }
};

export const updateKomoditas = async (req, res) => {
  try {
    const { id_commodity } = req.params;
    let { namabarang, descbarang, satuan, gambarbarang, stokbarang} = req.body;

    // Validasi input
    if (!namabarang || !descbarang || !satuan || !gambarbarang || !stokbarang) {
      return response(400, null, "Data Komoditas tidak lengkap", res);
    }

    let gambarURL = gambarbarang;

    if (gambarbarang && !gambarbarang.startsWith("http")) {
      gambarURL = `${req.protocol}://${req.get("host")}/public/images/${gambarbarang}`;
    }

    // Logging data yang akan dikirim ke database
    console.log('Parameter query:', [namabarang, descbarang, satuan, gambarURL, stokbarang]);

    const sql = `UPDATE commodity SET namabarang = $1, descbarang = $2, satuan = $3, gambarbarang = $4, stokbarang = $5 WHERE id_commodity = $10 RETURNING *`;

    const result = await pool.query(sql, [namabarang, descbarang, satuan, gambarURL, stokbarang]);

    if (result.rowCount) {
      const data = {
        isSuccess: result.rowCount,
        message: "Update Data Successfully",
        data: result.rows[0]
      };
      response(200, data, "Update Data is Successfully", res);
    } else {
      response(404, null, `Komoditas dengan id_commodity = ${id_commodity} tidak ditemukan`, res);
    }
  } catch (err) {
    console.error("Error updating komoditas:", err);
    response(500, null, `Error updating komoditas: ${err.message}`, res);
  }
}


