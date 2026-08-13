import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.route.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app: Express = express();
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  connectDB();
  console.log(`Auth service listening on port ${PORT}`);
});
