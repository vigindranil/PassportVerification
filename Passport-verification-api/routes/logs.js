import express from "express";
import { getLogDetails } from "../controllers/logController.js";

const router = express.Router();

router.get('/logs', getLogDetails);

export default router;
