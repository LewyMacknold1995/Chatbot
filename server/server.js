require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Debug logging
console.log('Environment variables:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});

const port = 3001; // Hardcoded for now to test

app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let conversations = [];
let leads = [];

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Conversations route
app.post('/api/conversations', (req, res) => {
  try {
    const conversation = {
      ...req.body,
      timestamp: new Date(),
      id: Date.now()
    };
    conversations.push(conversation);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leads route
app.post('/api/leads', (req, res) => {
  try {
    const lead = {
      email: req.body.email,
      conversation: req.body.conversation,
      timestamp: new Date(),
      id: Date.now()
    };
    leads.push(lead);
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations
app.get('/api/conversations', (req, res) => {
  res.json(conversations);
});

// Get all leads
app.get('/api/leads', (req, res) => {
  res.json(leads);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test the server at http://localhost:${port}/test`);
});