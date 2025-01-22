import express from "express";
import { test } from "../controllers/test.js";
const router = express.Router();

/**
 * @swagger
 * /api/test/test:
 *   get:
 *     summary: Test the API endpoint
 *     description: This endpoint is for testing purposes. It responds with a success message.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API is working"
 */
router.get("/test", test);

export default router;