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
