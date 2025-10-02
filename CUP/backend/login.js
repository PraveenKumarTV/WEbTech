// login.js
require('dotenv').config();

const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB Atlas connection string
const uri = process.env.mongoURI;
const client = new MongoClient(uri);

// Route: POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    await client.connect();
    const db = client.db('test'); // Replace with your DB name
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password match (plain-text, since no hashing is used)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Success
    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

module.exports = router;
