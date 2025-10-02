// signup.js
require('dotenv').config();

const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Replace with your MongoDB Atlas connection string
const uri = process.env.mongoURI;
const client = new MongoClient(uri);

// Route: POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await client.connect();
    const db = client.db('test'); // replace with your DB name
    const usersCollection = db.collection('users');

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Insert user
    await usersCollection.insertOne({ name, email, password });

    return res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

module.exports = router;
