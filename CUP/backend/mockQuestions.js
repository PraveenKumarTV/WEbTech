// server.js or routes/api.js

const express = require('express');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const axios = require('axios');

const router = express.Router();

const uri = 'mongodb+srv://praveenkumartv1:praveen123@praveendb.ac0h0.mongodb.net/';
const dbName = 'test';

const upload = multer({ dest: 'uploads/' });

const GEMINI_API_KEY = 'AIzaSyBQ2HHPynPs4_cY4XqtEwbLubDuH9bdS5M';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function extractText(filePath, mimetype) {
  if (mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  } else if (mimetype === 'application/msword') {
    return 'DOC format not supported. Please upload PDF or DOCX.';
  }
  return '';
}

async function getQuestionsFromGemini(resumeText) {
  const promptText = `Read the following resume and generate 5 mock interview questions relevant to the candidate's experience and skills:\n\n${resumeText}`;

  const body = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  const response = await axios.post(GEMINI_API_URL, body, {
    headers: { 'Content-Type': 'application/json' }
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const questions = text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => ({
      question: line.replace(/^\d+[\).]?\s*/, '').trim(),
    }));

  return questions;
}

// 🔥 NEW: Validate answer with Gemini
async function validateAnswerWithGemini(question, answer) {
  const prompt = `Here is an interview question and the candidate's answer:\n\nQuestion: ${question}\nAnswer: ${answer}\n\nEvaluate the answer. Give concise feedback, and rate it from 1 to 10.`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await axios.post(GEMINI_API_URL, body, {
    headers: { 'Content-Type': 'application/json' }
  });

  const feedback = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback provided.';
  return feedback;
}

// Endpoint: Generate questions from resume
router.post('/resume-questions', upload.single('resume'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const resumeText = await extractText(file.path, file.mimetype);
    if (!resumeText || resumeText.startsWith('DOC format not supported')) {
      return res.status(400).json({ error: resumeText });
    }
    const questions = await getQuestionsFromGemini(resumeText);
    res.json(questions);
  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to generate questions from resume' });
  } finally {
    fs.unlink(file.path, () => {});
  }
});

// Endpoint: Get default mock questions
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

// 🔥 NEW: Validate user answer
// POST /validate-answer
router.post('/validate-answer', async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  const prompt = `You're an interview evaluator. Here's a question and candidate's answer. Give specific feedback in 7 lines(dont use any bulletin points or bolding text, just give the entire answer in single para).

Question: ${question}

Answer: ${answer}

Feedback:`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const geminiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!geminiResponse) {
      return res.status(500).json({ error: 'No feedback received from Gemini' });
    }

    return res.json({ feedback: geminiResponse.trim() });
  } catch (err) {
    console.error('Gemini validation error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to get feedback from Gemini AI' });
  }
});


module.exports = router;
