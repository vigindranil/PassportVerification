import express from 'express';
import { redirectToPaymentStatus } from '../controllers/testController.js';


const router = express.Router();

router.post('/redirectToPaymentStatus', redirectToPaymentStatus);
export default router;
