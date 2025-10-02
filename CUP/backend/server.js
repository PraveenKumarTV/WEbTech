const express = require('express');
const cors = require('cors');
const projectsRouter = require('./projects');
const mockQuestionsRouter = require('./mockQuestions');
const signupRouter = require('./signup');
const loginRouter = require('./login'); // <-- ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', projectsRouter);
app.use('/api', mockQuestionsRouter);
app.use('/api', signupRouter);
app.use('/api', loginRouter); // <-- ADD THIS

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
