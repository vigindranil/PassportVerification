import express from 'express';
import {updateCriminalInfo} from '../controllers/crimeController.js';

const router = express.Router();


router.post('/updateCriminalInfo', updateCriminalInfo);
export default router;