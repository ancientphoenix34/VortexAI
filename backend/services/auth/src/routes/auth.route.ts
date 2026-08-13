import express, { Router } from 'express';
import { login, logOut } from '../controllers/auth.controller.js';

const router: Router = express.Router();

router.post('/login', login);
router.post('/logout', logOut);

export default router;

