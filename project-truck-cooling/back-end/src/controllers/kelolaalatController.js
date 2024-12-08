import {response} from '../res/response.js'
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
});

export const getKelolaAlat = async (req, res) => {
    try {
        console.log("Menerima permintaan GET /alat");
        const result = await pool.query(
          "SELECT * FROM konfigurasiAlat"
        );
        console.log("Data alat berhasil diambil:", result.rows);
        res.json(result.rows);
      } catch (err) {
        console.error("Error di GET /alat:", err);
        response(500, "invalid", "error", err);
      }
};

export const getKelolaAlatid = async (req, res)=> {
    try{
        const id_sewa = req.params.id_sewa
        const sql = `SELECT * FROM konfigurasiAlat WHERE id_sewa = $1`
        const result = await pool.query(sql, [id_sewa])
        if(result.rows.length > 0){
            response(200, result.rows, `alat by id_sewa = '${id_sewa}'`, res)
        }else{
            response(404, null, `alat with id_sewa = '${id_sewa}' not found`, res)
        }
    }catch(err){
        response(500, "invalid", "error", res);
    }
}



