const express = require('express');
const cors = require('cors');
const projectsRouter = require('./projects');
const mockQuestionsRouter = require('./mockQuestions');

const app = express();
app.use(cors());
app.use('/api', projectsRouter);
app.use('/api', mockQuestionsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});