import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway', // Use the full connection string
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

  router.get('/alat/:imei', getAlatFromIMEI);
router.post('/alat', postAlat);
router.put('/alat/:imei', updateAlatBerdasarkanIMEI);
router.delete('/alat/:imei', hapusAlatBerdasarkanIMEI);

  export const getAlatFromIMEI = async (req, res) => {
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

  // Route untuk menambah alat baru
app.post("api/alat", async (req, res) => {
    const { namaalat, imei, serialat, tanggal_produksi, statusalat, gambar } =
      req.body;
  
    // Jika gambar disimpan secara lokal, ubah nama gambar menjadi path yang benar
    let gambarURL = gambar;
    if (!gambar.startsWith("http")) {
      gambarURL = `${req.protocol}://${req.get("host")}/public/images/${gambar}`;
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO public.alat (namaalat, imei, serialat, tanggal_produksi, statusalat, gambar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING imei, id_alat, namaalat, statusalat, to_char(tanggal_produksi, 'YYYY-MM-DD') AS tanggal, serialat, gambar",
        [namaalat, imei, serialat, tanggal_produksi, statusalat, gambarURL]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  // Route untuk mengupdate alat berdasarkan IMEI
app.put("api/alat/:imei", async (req, res) => {
    const { imei } = req.params;
    const { namaalat, serialat, tanggal_produksi, statusalat, gambar } = req.body;
  
    // Jika gambar disimpan secara lokal, ubah nama gambar menjadi path yang benar
    // Contoh: 'nama_gambar.jpg' menjadi '/public/images/nama_gambar.jpg'
    // Jika gambar disimpan secara eksternal, pastikan URL sudah benar
    let gambarURL = gambar;
    if (!gambar.startsWith("http")) {
      gambarURL = `${req.protocol}://${req.get("host")}/public/images/${gambar}`;
    }
  
    try {
      const result = await pool.query(
        "UPDATE public.alat SET namaalat = $1, serialat = $2, tanggal_produksi = $3, statusalat = $4, gambar = $5 WHERE imei = $6 RETURNING imei, id_alat, namaalat, statusalat, to_char(tanggal_produksi, 'YYYY-MM-DD') AS tanggal, serialat, gambar",
        [namaalat, serialat, tanggal_produksi, statusalat, gambarURL, imei]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Alat tidak ditemukan");
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  app.delete("api/alat/:imei", async (req, res) => {
    const { imei } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM public.alat WHERE imei = $1 RETURNING *",
        [imei]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Alat tidak ditemukan");
      }
      res.json({ message: "Alat berhasil dihapus" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });


  
  