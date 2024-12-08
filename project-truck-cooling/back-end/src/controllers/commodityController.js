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

  export const postCommodity = async (req, res) => {
    try {
        const { id_konfigurasi, namabarang, descbarang, satuan, stokbarang, gambarbarang } = req.body;

        console.log("Menerima permintaan POST /commodity:", req.body);

        let gambarURL = gambarbarang;
        if (gambarbarang && !gambarbarang.startsWith("http")) {
            gambarURL = `${req.protocol}://${req.get("host")}/public/images/${gambarbarang}`;
        }

        const query = `
            INSERT INTO public.commodity (id_konfigurasi, namabarang, descbarang, satuan, stokbarang, gambarbarang)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_konfigurasi, namabarang, descbarang, satuan, stokbarang, gambarbarang;
        `;
        const values = [id_konfigurasi, namabarang, descbarang, satuan, stokbarang, gambarURL];

        const result = await pool.query(query, values);

        console.log("Commodity berhasil ditambahkan:", result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error di POST /commodity:", err);
        res.status(500).send("Server Error");
    }
};


export const putCommodity = async (req, res) => {
  try {
      const { id } = req.params; // Ambil ID dari parameter URL
      const { namabarang, descbarang, satuan, stokbarang, gambarbarang } = req.body; // Ambil data dari request body
      
      console.log("Menerima permintaan PUT untuk id:", id, "dengan data:", req.body);

      // Periksa apakah semua field yang dibutuhkan tersedia
      if (!namabarang || !descbarang || !satuan || !stokbarang) {
          return res.status(400).json({
              message: "Semua field (namabarang, descbarang, satuan, stokbarang) harus diisi.",
          });
      }

      const query = `
          UPDATE public.commodity
          SET namabarang = $1,
              descbarang = $2,
              satuan = $3,
              stokbarang = $4,
              gambarbarang = $5
          WHERE id_commodity = $6
          RETURNING id_commodity, namabarang, descbarang, satuan, stokbarang, gambarbarang;
      `;
      const values = [namabarang, descbarang, satuan, stokbarang, gambarbarang || null, id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          console.error(`Commodity dengan id ${id} tidak ditemukan.`);
          return res.status(404).json({
              message: `Commodity dengan id ${id} tidak ditemukan.`,
          });
      }

      console.log("Commodity berhasil diperbarui:", result.rows[0]);
      res.status(200).json({
          message: "Commodity berhasil diperbarui.",
          updatedCommodity: result.rows[0],
      });
  } catch (err) {
      console.error("Error di PUT /commodity:", err);
      res.status(500).send("Server Error");
  }
};


export const deleteCommodity = async (req, res) => {
  try {
      const { id } = req.params; // Ambil ID dari parameter URL
      console.log("Menerima permintaan DELETE untuk id:", id);

      const query = `
          DELETE FROM public.commodity
          WHERE id_commodity = $1
          RETURNING id_commodity, namabarang, descbarang, satuan, stokbarang, gambarbarang;
      `;
      const values = [id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          console.error(`Commodity dengan id ${id} tidak ditemukan.`);
          return res.status(404).json({
              message: `Commodity dengan id ${id} tidak ditemukan.`,
          });
      }

      console.log("Commodity berhasil dihapus:", result.rows[0]);
      res.status(200).json({
          message: "Commodity berhasil dihapus.",
          deletedCommodity: result.rows[0],
      });
  } catch (err) {
      console.error("Error di DELETE /commodity:", err);
      res.status(500).send("Server Error");
  }
};

