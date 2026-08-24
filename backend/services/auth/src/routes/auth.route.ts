import express, { Router } from 'express';
import { login, logOut, updateUserPayment } from '../controllers/auth.controller.js';

const router: Router = express.Router();

router.post('/login', login);
router.get('/logout', logOut);
router.post("/update-plan", updateUserPayment)

export default router;

