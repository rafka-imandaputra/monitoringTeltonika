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

export const getAlat =  async (req, res) => {
    try {
      console.log("Menerima permintaan GET /alat");
      const result = await pool.query(
        "SELECT imei, id_alat, namaalat, statusalat, to_char(tanggal_produksi, 'YYYY-MM-DD') AS tanggal, serialat, gambar FROM public.alat"
      );
      console.log("Data alat berhasil diambil:", result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error("Error di GET /alat:", err);
      res.status(500).send("Server Error");
    }
  });