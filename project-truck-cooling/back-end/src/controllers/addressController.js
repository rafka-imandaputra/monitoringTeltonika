import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway', // Use the full connection string
});

//get data provinsi
export const getProvinsi = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT provinsi FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No provinces found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
};

//get kabupaten data
export const geKabupatenKota = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT kabupaten FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No kabupaten/kota found.' }); // Changed message for clarity
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
};

//get data kecamatan
export const getKecamatan = async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT kecamatan FROM Client');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No kecamatan found.' }); // Changed message for clarity
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
};