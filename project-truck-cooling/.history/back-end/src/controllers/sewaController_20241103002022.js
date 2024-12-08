import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

"api/sewa/:id_klien"

export const getSewaByClient = async (req, res) => {
    try {
      const id_klien = req.params.id_klien;
      const result = await pool.query(
        `SELECT sewa.id_sewa, alat.imei, alat.namaalat, client.id_client, client.namaclient 
         FROM public.sewa 
         INNER JOIN public.alat ON sewa.imei = alat.imei 
         INNER JOIN public.client ON client.id_client = sewa.id_client 
         WHERE sewa.id_client = $1`,
        [id_klien]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });