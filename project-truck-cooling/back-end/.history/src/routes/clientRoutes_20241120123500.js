import express from 'express';
import { createClient, getClients, updateClient, detailClients, deleteClient, suspendClient, restoreClient, resetPassword, getClientByEmail} from '../controllers/clientController.js';

const router = express.Router();

//routes client
router.post('/clients', createClient);
router.get('/clients', getClients);
router.get('/clients/:id', detailClients);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);
router.put('/clients/:id/suspend', suspendClient);
router.put('/clients/:id/restore', restoreClient);
router.put('/clients/:id/reset-password/', resetPassword);
router.get('/clients/getbyemail/:email', getClientByEmail);
export default router;