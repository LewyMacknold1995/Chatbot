require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot";
const client = new MongoClient(uri);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Conversations route
app.post('/api/conversations', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('chatbot');
    const conversations = database.collection('conversations');
    
    const result = await conversations.insertOne({
      ...req.body,
      timestamp: new Date()
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leads route
app.post('/api/leads', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('chatbot');
    const leads = database.collection('leads');
    
    // Save lead to database
    const result = await leads.insertOne({
      email: req.body.email,
      conversation: req.body.conversation,
      timestamp: new Date()
    });

    // Send notification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'New Chatbot Lead',
      text: `New lead collected: ${req.body.email}\n\nConversation:\n${req.body.conversation}`
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations
app.get('/api/conversations', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('chatbot');
    const conversations = database.collection('conversations');
    
    const result = await conversations.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('chatbot');
    const leads = database.collection('leads');
    
    const result = await leads.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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