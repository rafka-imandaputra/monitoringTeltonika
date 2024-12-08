import { response } from '../res/response.js';
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

// Get all perpanjangan data
export const getPerpanjangan = async (req, res) => {
  try {
    console.log("Menerima permintaan GET /perpanjangan");
    const result = await pool.query("SELECT * FROM perpanjang_view");
    console.log("Data berhasil diambil:", result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error di GET /perpanjangan:", err);
    res.status(500).json({ error: "Error retrieving data" });
  }
};
