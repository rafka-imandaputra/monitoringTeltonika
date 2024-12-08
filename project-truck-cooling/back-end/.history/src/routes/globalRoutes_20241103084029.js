import express from 'express';
import {getKelolaAlat, getKelolaAlatid} from '../controllers/kelolaalatController.js';
import { getKelolaKomoditas } from '../controllers/KelolaKomoditasController.js';
import { konfigurasiAlat, konfigurasiAlatid, postColdStorage, postPerjalanan, updateKonfigurasi } from '../controllers/konfigurasiController.js';
import { getAlat, getAlatFromIMEI, postAlat,
     updateAlatBerdasarkanIMEI, hapusAlatBerdasarkanIMEI} from '../controllers/alatController.js';
import {teltonikaEndpointToDB, getDashboardPinpoints} from '../controllers/monitoringController.js';
import {getLog_track, getLog_trackByIMEI} from '../controllers/log_trackController.js';
import {getSewaByClient, getSewa, postSewaTest, getSewaWithView} from '../controllers/sewaController.js'
import { getCommodityByID, getCommodity} from '../controllers/commodityController.js';

const router = express.Router();

//Alat
router.get('/alat', getAlat);
router.get('/alat/:imei', getAlatFromIMEI);
router.post('/alat', postAlat);
router.put('/alat/:imei', updateAlatBerdasarkanIMEI);
router.delete('/alat/:imei', hapusAlatBerdasarkanIMEI);

//Monitoring
router.post('/teltonikaDB', teltonikaEndpointToDB);
router.get('/dashboardPinPoints', getDashboardPinpoints);

//log_track
router.get('/log_track', getLog_track);
router.get('/log_track/:imei', getLog_trackByIMEI);

//sewa
router.get('/sewa/:id_klien', getSewaByClient);
router.get('/sewa', getSewa);
router.post('/sewa', postSewaTest);
// router.get('/sewaView', getSewaWithView);

//commodity
router.get('commodity/:id_commodity', getCommodityByID);
router.get('commodity', getCommodity);


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
