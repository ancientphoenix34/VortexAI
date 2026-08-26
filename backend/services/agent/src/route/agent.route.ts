import { Router } from 'express';
import { Agent } from '../controllers/agent.controller.js';
import multer from '../config/multer.js';

const router = Router();

router.post('/chat', multer.single("file"), Agent);

export default router;
