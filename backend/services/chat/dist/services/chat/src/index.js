import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.routes.js';
dotenv.config();
const PORT = process.env.PORT || 5002;
const app = express();
app.use(express.json());
app.use('/', chatRoutes);
app.use('/api/chat', chatRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'chat' });
});
app.listen(PORT, () => {
    connectDB();
    console.log(`Chat service listening on port ${PORT}`);
});
