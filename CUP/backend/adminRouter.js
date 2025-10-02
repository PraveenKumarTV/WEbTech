// adminRouter.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { client, connectClient } = require('./dbClient');

const router = express.Router();

// Ensure DB name
const DB_NAME = 'test';

// Helper to get correct collection
function getCollection(type) {
  const db = client.db(DB_NAME);
  if (type === 'questions' || type === 'mock-questions') {
    return db.collection('mock_questions'); // or collection name "mockQuestions"
  } else if (type === 'projects') {
    return db.collection('ProjectsCol');
  }
  throw new Error('Invalid collection type');
}

// GET all
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    await connectClient();
    const coll = getCollection(type);
    const items = await coll.find({}).toArray();
    res.json(items);
  } catch (err) {
    console.error('GET /admin/', type, err);
    res.status(500).json({ error: err.message });
  }
});

// GET one by ID
router.get('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    await connectClient();
    const coll = getCollection(type);
    const item = await coll.findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('GET /admin/:id', type, id, err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/:type', async (req, res) => {
  const { type } = req.params;
  const newItem = req.body;
  try {
    await connectClient();
    const coll = getCollection(type);
    const result = await coll.insertOne(newItem);
    // result.insertedId etc
    const inserted = await coll.findOne({ _id: result.insertedId });
    res.status(201).json(inserted);
  } catch (err) {
    console.error('POST /admin/', type, err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const updateData = req.body;
  try {
    await connectClient();
    const coll = getCollection(type);
    await coll.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updated = await coll.findOne({ _id: new ObjectId(id) });
    res.json(updated);
  } catch (err) {
    console.error('PUT /admin/', type, id, err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    await connectClient();
    const coll = getCollection(type);
    await coll.deleteOne({ _id: new ObjectId(id) });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /admin/', type, id, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
