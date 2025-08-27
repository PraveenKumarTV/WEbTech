const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
const router = express.Router();

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoUri);

const geminiApiUrl = process.env.GEMINI_API_URL;
const geminiApiKey = process.env.GEMINI_API_KEY;

router.get('/questions', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const questions = await db.collection('InterviewQuestions').find().toArray();
    console.log(questions);
    res.json({ success: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error fetching questions' });
  }
});

router.post('/answer', async (req, res) => {
  try {
    const { questionId, answerText } = req.body;
    await client.connect();
    const db = client.db(dbName);
    const question = await db.collection('InterviewQuestions').findOne({ _id: new ObjectId(questionId) });

    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    // Send to Gemini API
    const payload = {
      question: question.text,
      answer: answerText
    };

    const geminiResponse = await axios.post(
      geminiApiUrl,
      payload,
      { headers: { Authorization: `Bearer ${geminiApiKey}` } }
    );

    res.json({ success: true, feedback: geminiResponse.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error processing answer' });
  }
});

module.exports = router;
