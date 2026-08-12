import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use("/auth",proxy(process.env.AUTH_SERVICE))

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
