require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
