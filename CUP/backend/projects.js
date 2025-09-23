// backend/projects.js
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://localhost:27017'; // Change if your MongoDB is elsewhere
const dbName = 'local'; // Replace with your actual DB name

router.get('/projects', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const projects = await db.collection('ProjectsCol').find({}).toArray();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  } finally {
    if (client) client.close();
  }
});

module.exports = router;