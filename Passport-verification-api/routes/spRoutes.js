import express from 'express';
import {transferapplication} from '../controllers/spController.js';
const router = express.Router();

router.post('/transferapplication', transferapplication);
export default router;