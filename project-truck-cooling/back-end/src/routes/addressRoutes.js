import express from 'express';
import { geKabupatenKota, getKecamatan, getProvinsi} from '../controllers/addressController.js';


const router = express.Router();
//routes alamat
router.get('/provinsi', getProvinsi);
router.get('/kecamatan', getKecamatan);
router.get('/kabupaten-kota', geKabupatenKota);

export default router; 