import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});


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
  };

export const getAlatFromIMEI =  async (req, res) => {
    const { imei } = req.params;
    try {
      const result = await pool.query(
        "SELECT imei, id_alat, namaalat, statusalat, to_char(tanggal_produksi, 'YYYY-MM-DD') AS tanggal, serialat, gambar FROM public.alat WHERE imei = $1",
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