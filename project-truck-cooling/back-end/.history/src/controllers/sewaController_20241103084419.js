import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

export const getSewa =  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM sewa
      `);
      
      console.log(result.rows);  // Debug: Lihat apakah data muncul
      res.json(result.rows);  // Mengirimkan hasil query ke frontend
    } catch (err) {
      console.error("Error di GET /sewa:", err);
      res.status(500).send("Server Error");
    }
  };

  export const getSewaWithView = async (req, res) => {
    try {
      console.log("Menerima permintaan GET /sewa");
      const result = await pool.query(
        "SELECT * FROM ViewSewaClient"
      );
      console.log("Data alat berhasil diambil:", result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error("Error di GET /alat:", err);
      res.status(500).send("Server Error");
    }
  };

export const getSewaByClient = async (req, res) => {
    try {
      const { id_klien } = req.params;
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
  };

  export const postSewaTest = async (req, res) => {
    const { dataSewa } = req.body;
    console.log(dataSewa);

    try {
      const result = await pool.query(
        `INSERT INTO 
         sewa(id_client, imei, tanggalawalsewa, tanggalakhirsewa, tanggal_transaksi, nomor_transaksi)
         VALUES
         ($1,
          $2,
          $3,
          $4,
          $5,
          $6)`
        [dataSewa.id_client, dataSewa.id_client, dataSewa.imei, dataSewa.tanggalawalsewa, dataSewa.tanggalakhirsewa, dataSewa.tanggal_transaksi, dataSewa.nomor_transaksi]
      );
      res.json(dataSewa);
    } catch (err) {
      console.error(err);
      res.status(500).send(dataSewa);
    }
  };

