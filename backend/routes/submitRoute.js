import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const submitRoute = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
  });

  async function sendAlertEmail(ip, failedAttempts) {
    const mailOptions = {
        from: process.env.SMTP_EMAIL, // sender address
        to: process.env.ALERT_EMAIL,  // recipient address (should be a valid email)
        subject: 'Alert: Failed POST Request',
        text: 'A failed POST request was detected from your IP.',
      };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent for IP ${ip}`);
    } catch (error) {
      console.error('Failed to send alert email:', error);
    }
  }

// Log model (for storing invalid request details)
const logSchema = new mongoose.Schema({
    ip: String,
    timestamp: { type: Date, default: Date.now },
    reason: String,
    failedAttempts: { type: Number, default: 0 }, // New field to track failed attempts
  });
  
  const Log = mongoose.model('Log', logSchema);

const failedRequestSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  const FailedRequest = mongoose.model('FailedRequest', failedRequestSchema);

// Middleware to validate POST requests
submitRoute.post('/', async (req, res) => {
  const { authorization } = req.headers;
  const ip = req.ip || req.connection.remoteAddress;
  const threshold = 5; // Max failed attempts before triggering an alert
  const timeWindow = 10 * 60 * 1000; // 10 minutes in milliseconds


  // Validate Authorization header
  if (!authorization || authorization !== 'Bearer your-access-token') {
    const now = Date.now();
    // Count failed attempts from this IP within the time window
    const failedAttempts = await Log.countDocuments({
        ip,
        timestamp: { $gte: new Date(now - timeWindow) },
      });
  
      // Log the new failed attempt
      await Log.create({ ip, reason: 'Invalid Authorization Header' });

      const newFailedRequest = new FailedRequest({
        ip: req.ip, // Request IP
        reason: 'Invalid Authorization Header', // You can customize this based on the error
      });
      
      await newFailedRequest.save();
  
      // If failed attempts exceed the threshold, send an alert
      if (failedAttempts + 1 >= threshold) {
        sendAlertEmail(ip, failedAttempts + 1);
      }
  
      return res.status(401).json({ error: 'Unauthorized request' });
    }
  

  // If valid, proceed
  res.status(200).json({ message: 'Request successful!' });
});

export default submitRoute;
export { FailedRequest }; // Add this at the bottom of your file
