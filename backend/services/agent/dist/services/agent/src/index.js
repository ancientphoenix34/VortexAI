import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5004;
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'agent-service' });
});
app.listen(PORT, () => {
    connectDB();
    console.log(`Agent service running on port ${PORT}`);
});
