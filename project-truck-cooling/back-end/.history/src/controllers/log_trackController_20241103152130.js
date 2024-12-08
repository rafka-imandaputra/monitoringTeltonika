import {response} from '../res/response.js'
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

    export const getLog_track =  async (req, res) => {
        try {
        const result = await pool.query(
            `SELECT * from riwayat
            ORDER BY timestamplog ASC`,
        );
        res.json(result.rows);
        } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
        }
    };

    export const getLog_trackByIDClient =  async (req, res) => {
        const id_klien = req.params.id_klien;
    
        try {
        const result = await pool.query(
            `SELECT *
            FROM public.riwayat 
            JOIN public.sewa ON sewa.imei = riwayat.imei
            WHERE sewa.id_client = $1
            ORDER BY timestamplog ASC`,
            [id_klien]
        );
        res.json(result.rows);
        } catch (err) {
        console.error(err);
        res.status(500).send(id_klien);
        }
    };

    export const getLog_trackByIMEI =  async (req, res) => {
        const { imei } = req.params;
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
          res.status(500).send(imei);
          console.log(imei);

        }
      };

