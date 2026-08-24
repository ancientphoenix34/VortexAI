import express, { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/billing.controller.js';

const router: Router = express.Router();

router.post('/create', createOrder);
router.post('/verify', verifyPayment);

export default router;
