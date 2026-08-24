import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './route/billing.route.js';

dotenv.config();

const PORT = process.env.PORT || 5004;

const app: Express = express();
app.use(express.json());

app.use('/', router);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'billing' });
});

app.listen(PORT, () => {
  console.log(`Billing service listening on port ${PORT}`);
  connectDB();
});
