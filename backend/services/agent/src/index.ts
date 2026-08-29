import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './route/agent.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(express.json());
app.use('/', router);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  if (err.status) {
    return res.status(err.status).json(err.data);
  }
  return res.status(500).json({
    message: `agent error: ${err.message || err}`,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'agent-service' });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Agent service running on port ${PORT}`);
});
