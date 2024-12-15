import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import submitRoute from './routes/submitRoute.js';
import { FailedRequest } from './routes/submitRoute.js'; // Import FailedRequest model




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Server is running with ES Modules!');
});

app.use('/api/submit', submitRoute);

app.get('/api/metrics', async (req, res) => {
    try {
      const failedRequests = await FailedRequest.find();
      res.status(200).json(failedRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching metrics', error });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
