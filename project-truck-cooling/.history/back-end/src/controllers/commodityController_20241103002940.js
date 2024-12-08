import {response} from '../res/response.js'
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

export const getCommodity = async(req, res) => {
    try {
      console.log("Menerima permintaan GET /commodity");
      const result = await pool.query(
        "SELECT id_konfigurasi, id_commodity, namabarang, descbarang, satuan, stokbarang, gambarbarang FROM public.commodity"
      );
      console.log("Data barang berhasil diambil:", result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error("Error di GET /commodity:", err);
      res.status(500).send("Server Error");
    }
  };

export const getCommodityByID = async (req, res) => {
    const { imei } = req.params;
    try {
      const result = await pool.query(
        "SELECT id_konfigurasi, id_commodity, namabarang, descbarang, satuan, stokbarang, gambarbarang FROM public.commodity WHERE id_commodity = $1",
        [imei]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Alat tidak ditemukan");
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };