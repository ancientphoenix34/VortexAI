import express, { Express } from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from '../middleware/auth.middleware.js';
import { getCurrentUser } from '../controller/user.controller.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:5001';

const app: Express = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(cookieParser());
app.use('/api/auth', proxy(AUTH_SERVICE));
app.get('/api/me', protect, getCurrentUser);

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});

