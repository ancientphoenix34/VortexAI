import { Router } from 'express';
import { Agent } from '../controllers/agent.controller.js';

const router = Router();

router.post('/chat', Agent);

export default router;
