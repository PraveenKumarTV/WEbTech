const express = require('express');
const router = express.Router();

let assignments = [];

// Show all assignments
router.get('/', (req, res) => {
  res.render('index', { assignments });
});

// Show add form
router.get('/add', (req, res) => {
  res.render('add');
});

// Handle form submission
router.post('/add', (req, res) => {
  const { title, description, dueDate } = req.body;
  assignments.push({ title, description, dueDate });
  res.redirect('/');
});

module.exports = router;
