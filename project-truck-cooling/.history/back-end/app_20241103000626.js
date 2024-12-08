// app.js
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./auth.js";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import path from "path";
import { env } from "process"

import clientRoutes from "./src/routes/clientRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import globalRoutes from "./src/routes/globalRoutes.js";
import index from "./src/routes/index.js";
import users from "./src/routes/users.js";

// import routes from "./src/routes/Routes.js";

// Inisialisasi dotenv untuk memuat variabel lingkungan dari .env
dotenv.config();

// Membuat instance Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan semua permintaan cross-origin
app.use(bodyParser.json()); // Untuk mem-parsing request body dalam format JSON

// Menyajikan file statis dari folder 'public'
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/auth", authRoutes); // Route untuk autentikasi
app.use('/api', clientRoutes);
app.use('/api', addressRoutes);
app.use('/api', globalRoutes);
app.use('/api', index);
app.use('/api', users);

// PostgreSQL Pool Configuration
// const pool = new Pool({
//   connectionString:
//     "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
// });

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT
});

// Menguji koneksi ke database
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log("Connection successful:", res.rows);
  }
});

// =============================
// Endpoint CRUD untuk Alat
// =============================


app.get("api/sewa", async (req, res) => {
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
});

app.get("api/commodity", async (req, res) => {
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
});

// Route untuk mendapatkan detail alat berdasarkan IMEI
app.get("api/commodity/:id_commodity", async (req, res) => {
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
});

// Route untuk mendapatkan detail alat berdasarkan IMEI



// =============================
// Endpoint Lainnya (Opsional)
// =============================

// Pastikan untuk memformat tanggal_produksi di route lainnya jika diperlukan

// Route untuk mendapatkan semua clients

// app.get("/clients", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id_client as id, namaclient as label FROM public.client"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// Route untuk mendapatkan semua sewa
// app.get("/sewa", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT sewa.id_sewa, alat.imei, alat.namaalat, client.id_client, client.namaclient, sewa.nomor_transaksi, sewa.tanggal_transaksi 
//        FROM public.sewa 
//        INNER JOIN public.alat ON sewa.imei = alat.imei 
//        INNER JOIN public.client ON client.id_client = sewa.id_client`
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

app.get("api/sewa", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        nomor_transaksi, 
        namaclient, 
        kontakclient, 
        email, 
        tanggal_transaksi
      FROM ViewSewaClient
    `);
    
    console.log(result.rows);  // Debug: Lihat apakah data muncul
    res.json(result.rows);  // Mengirimkan hasil query ke frontend
  } catch (err) {
    console.error("Error di GET /sewa:", err);
    res.status(500).send("Server Error");
  }
});



// Route untuk mendapatkan sewa berdasarkan id_klien
app.get("api/sewa/:id_klien", async (req, res) => {
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

// Route untuk mendapatkan alat berdasarkan id_klien
app.get("api/alatklien", async (req, res) => {
  const temp_id_klien = 2; // Ganti sesuai kebutuhan

  try {
    const result = await pool.query(
      `
      SELECT alat.imei as id, namaalat as label 
      FROM public.alat 
      JOIN public.sewa ON sewa.imei = alat.imei 
      WHERE sewa.id_client = $1`,
      [temp_id_klien]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route untuk mendapatkan log track berdasarkan IMEI
app.get("api/log_track/:imei", async (req, res) => {
  const imei = req.params.imei;

  try {
    const result = await pool.query(
      `SELECT imei, log_latitude, log_longitude, timestamplog, suhu2
       FROM public.riwayat 
       WHERE imei = $1 
       ORDER BY timestamplog ASC`,
      [imei]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route untuk mendapatkan log track berdasarkan id_klien
app.get("api/log_track_id/:id_klien", async (req, res) => {
  const id_klien = req.params.id_klien;

  try {
    const result = await pool.query(
      `SELECT imei, log_latitude, log_longitude, timestamplog 
       FROM public.riwayat 
       JOIN public.sewa ON sewa.imei = riwayat.imei
       WHERE sewa.id_client = $1
       ORDER BY timestamplog ASC`,
      [id_klien]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route untuk mendapatkan dashboard pinpoints
app.get("/api/dashboardPinpoints", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (r.id_alat)
          c.namaclient AS "client",
          to_char(r.timestamplog, 'YYYY-MM-DD') AS "time", -- Format tanggal
          r.log_latitude AS "latitude",
          r.log_longitude AS "longitude",
          r.suhu2 AS "temperature",
          co.namabarang AS "item",
          co.descbarang AS "detail_url",
          co.beratbarang AS "storage",
          r.timestamplog
      FROM public.riwayat r
      JOIN public.alat a ON r.id_alat = a.id_alat
      JOIN public.client c ON a.id_sewa = c.id_client
      JOIN public.perjalanan p ON r.route_id = p.route_id
      JOIN public.commodity co ON p.route_id = co.route_id
      ORDER BY r.id_alat, r.timestamplog DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching pinpoint data");
  }
});

// =============================
// Menjalankan Server
// =============================
pool.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Database berhasil ditemukan");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("DB_NAME:", process.env.DB_NAME);
});
