import express from 'express';
import {getKelolaAlat, getKelolaAlatid} from '../controllers/kelolaalatController.js';
import { getKelolaKomoditas } from '../controllers/KelolaKomoditasController.js';
import { konfigurasiAlat, konfigurasiAlatid, postColdStorage, postPerjalanan, updateKonfigurasi } from '../controllers/konfigurasiController.js';
import { getAlat, getAlatFromIMEI, postAlat, updateAlatBerdasarkanIMEI} from '../controllers/alatController.js';
const router = express.Router();

//Alat
router.get('/alat', getAlat);
router.get('/alat/:imei', getAlatFromIMEI)
router.post('/alat', postAlat);

//KELOLA ALAT CLIENT
router.get('/kelolaalat', getKelolaAlat);
router.get('/kelolaalat/:id_sewa', getKelolaAlatid);

//KONIGURASIALAT
router.get('/konfigurasi', konfigurasiAlat);
router.get('/konfigurasi/:id_sewa', konfigurasiAlatid);
router.put('/konfigurasi/:id_sewa', updateKonfigurasi);

//PERJALANAN
router.post('/perjalanan/:id_sewa', postPerjalanan);

//COLDSTORAGE
router.post('/coldstorage/:id_sewa', postColdStorage);

//KELOLA KOMODITAS
router.get('/kelolakomoditas', getKelolaKomoditas);

export default router;
