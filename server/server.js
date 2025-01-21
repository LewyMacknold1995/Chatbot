require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;

// Request logging middleware - add this before other middleware
app.use((req, res, next) => {
    console.log('\n=== New Request ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body) {
        console.log('Body:', req.body);
    }
    console.log('===================\n');
    next();
});

app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let conversations = [];
let leads = [];

// Test route with logging
app.get('/test', (req, res) => {
    console.log('Test endpoint accessed');
    res.json({ message: 'Server is running!' });
});

// Conversations route with logging
app.post('/api/conversations', (req, res) => {
    try {
        console.log('Received new conversation:', req.body);
        const conversation = {
            ...req.body,
            timestamp: new Date(),
            id: Date.now()
        };
        conversations.push(conversation);
        console.log('Stored conversation:', conversation);
        console.log('Total conversations:', conversations.length);
        res.json(conversation);
    } catch (error) {
        console.error('Error in conversations route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Leads route with logging
app.post('/api/leads', (req, res) => {
    try {
        console.log('Received new lead:', req.body);
        const lead = {
            email: req.body.email,
            conversation: req.body.conversation,
            timestamp: new Date(),
            id: Date.now()
        };
        leads.push(lead);
        console.log('Stored lead:', lead);
        console.log('Total leads:', leads.length);
        res.json(lead);
    } catch (error) {
        console.error('Error in leads route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get routes with logging
app.get('/api/conversations', (req, res) => {
    console.log('Fetching all conversations');
    console.log('Total conversations:', conversations.length);
    res.json(conversations);
});

app.get('/api/leads', (req, res) => {
    console.log('Fetching all leads');
    console.log('Total leads:', leads.length);
    res.json(leads);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
    console.log('\n=== Server Started ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Port: ${port}`);
    console.log(`Test URL: http://localhost:${port}/test`);
    console.log('===================\n');
});