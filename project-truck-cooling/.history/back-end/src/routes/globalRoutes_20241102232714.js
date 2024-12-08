import express from 'express';
import {getKelolaAlat, getKelolaAlatid} from '../controllers/kelolaalatController.js';
import { getKelolaKomoditas } from '../controllers/KelolaKomoditasController.js';
import { konfigurasiAlat, konfigurasiAlatid, postColdStorage, postPerjalanan, updateKonfigurasi } from '../controllers/konfigurasiController.js';

const router = express.Router();

//KELOLA ALAT CLIENT
router.get('/alat', getKelolaAlat);
router.get('/alat/:id_sewa', getKelolaAlatid);

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
