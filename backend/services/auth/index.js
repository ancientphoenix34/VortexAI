import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening to ${PORT}`);
});
