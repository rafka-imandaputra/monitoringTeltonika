import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

export const getSewa =  async (req, res) => {
    try {
      const result = await pool.query(`
          SELECT DISTINCT 
          client.id_client, 
	        client.namaclient,
          client.kontakclient,
	        client.email,
          sewa.nomor_transaksi, 
          sewa.tanggal_transaksi
      FROM client
      JOIN sewa ON client.id_client = sewa.id_client;
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

  export const getSewaByClientIMEI = async (req, res) => {
    try {
      const { imei } = req.params;
      const result = await pool.query(
        `SELECT sewa.id_sewa, alat.imei, alat.namaalat, client.id_client, client.namaclient 
         FROM public.sewa 
         INNER JOIN public.alat ON sewa.imei = alat.imei 
         INNER JOIN public.client ON client.id_client = sewa.id_client 
         WHERE sewa.imei = $1`,
        [imei]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };


  export const postSewaTest = async (req, res) => {
    try {
      const { id_client, tanggal_transaksi, alat} = req.body;
      for(let i = 0; i < alat.length; i++){
        console.log("Menerima permintaan POST /sewa");
        const alatNow = alat[i];
        const imei = alatNow.imei;
        const tanggalakhirsewa = alatNow.tanggalakhirsewa;
        const tanggalawalsewa = alatNow.tanggalawalsewa;

        // Validasi input dari body request
        if (!tanggal_transaksi || !id_client) {
          return res.status(400).send("Semua field harus diisi");
        }
    
        // Ambil data klien dari database
        const clientQuery = `SELECT namaclient, kontakclient, email FROM client WHERE id_client = $1`;
        const clientValues = [id_client];
        const clientResult = await pool.query(clientQuery, clientValues);
    
        if (clientResult.rows.length === 0) {
          return res.status(404).send("Klien tidak ditemukan");
        }
    
        const { namaclient, kontakclient, email } = clientResult.rows[0];
        console.log(clientResult.rows[0]);
    
        // const query = `
        //   INSERT INTO sewa (id_client, imei, tanggalawalsewa, tanggalakhirsewa, tanggal_transaksi)
        //   SELECT s.id_client, a.imei, to_timestamp($3, 'DD/MM/YYYY, HH24.MI.SS')::timestamp, to_timestamp($4, 'DD/MM/YYYY, HH24.MI.SS')::timestamp, to_timestamp($5, 'DD/MM/YYYY, HH24.MI.SS')::timestamp
        //   FROM client s, alat a
        //   WHERE s.id_client = $1 AND a.imei = $2
        //   RETURNING *;
        // `;
    
         const query = `
          INSERT INTO sewa (id_client, imei, tanggalawalsewa, tanggalakhirsewa, tanggal_transaksi)
          SELECT s.id_client, a.imei, $3, $4 , $5
          FROM client s, alat a
          WHERE s.id_client = $1 AND a.imei = $2
          RETURNING *;
        `;
      const values = [id_client, imei, tanggalawalsewa, tanggalakhirsewa, tanggal_transaksi];
      const result = await pool.query(query, values);
      console.log("Penyewaan berhasil ditambahkan:", result.rows[0]);

      }
      res.status(200);
    } catch (err) {
      console.error("Error di POST /sewa:", err);
      res.status(500).send("Server Error");
    }
    
  };