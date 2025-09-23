const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017'; // Update if needed
const dbName = 'local'; // Replace with your DB name

router.get('/mock-questions', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const questions = await db.collection('mock_questions').find({}).toArray();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mock interview questions' });
  } finally {
    if (client) client.close();
  }
});

module.exports = router;