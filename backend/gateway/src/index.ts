import express, { Express } from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from '../middleware/auth.middleware.js';
import { getCurrentUser } from '../controller/user.controller.js';
import { proxyWithHeader } from '../utils/proxyWithHeader.js';
import morgan from 'morgan';

dotenv.config();

const PORT = process.env.PORT || 5000;
const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:5001';
const CHAT_SERVICE = process.env.CHAT_SERVICE || 'http://localhost:5002';
const AGENT_SERVICE = process.env.AGENT_SERVICE || 'http://localhost:5004';
const BILLING_SERVICE = process.env.BILLING_SERVICE || 'http://localhost:5005';
const app: Express = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(morgan("dev"))
app.use(cookieParser());
app.use('/api/auth', proxy(AUTH_SERVICE));
app.use('/api/chat', protect, proxyWithHeader(CHAT_SERVICE));
app.use('/api/billing', protect, proxyWithHeader(BILLING_SERVICE));
app.use('/api/agent', protect, proxy(AGENT_SERVICE));
app.get('/api/me', protect, getCurrentUser);

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});

