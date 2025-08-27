let questions = [];
let selectedQuestionId = null;
let selectedQuestionText = '';

const ul = document.getElementById('questions-ul');
const questionTitle = document.getElementById('question-title');
const micBtn = document.getElementById('mic-button'); // 🎤 button
const transcriptBox = document.getElementById('transcript');
const feedbackArea = document.getElementById('feedback-area');

// Load questions from the backend
async function loadQuestions() {
  try {
    const res = await fetch('/api/questions');
    const data = await res.json();

    if (data.success) {
      questions = data.questions;
      ul.innerHTML = '';

      questions.forEach((q) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = q.question || 'Untitled Question';

        li.onclick = () => {
          selectQuestion(q._id, q.question, li);
        };

        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = '<li class="text-danger">Failed to load questions.</li>';
    }
  } catch (error) {
    console.error('Error loading questions:', error);
    ul.innerHTML = '<li class="text-danger">Server error.</li>';
  }
}

// When a question is selected
function selectQuestion(id, text, listItem) {
  selectedQuestionId = id;
  selectedQuestionText = text;

  questionTitle.textContent = `📝 ${text}`;
  transcriptBox.value = '';
  feedbackArea.innerHTML = '';
  micBtn.disabled = false;

  document.querySelectorAll('#questions-ul .list-group-item').forEach((el) =>
    el.classList.remove('active-question')
  );
  listItem.classList.add('active-question');
}

// Start speech recognition
function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Speech Recognition is not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  micBtn.classList.add('recording');
  micBtn.disabled = true;

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    transcriptBox.value = spoken;
  };

  recognition.onerror = (event) => {
    alert('Speech recognition error: ' + event.error);
    micBtn.classList.remove('recording');
    micBtn.disabled = false;
  };

  recognition.onend = () => {
    micBtn.classList.remove('recording');
    micBtn.disabled = false;

    if (transcriptBox.value.trim()) {
      sendAnswer(transcriptBox.value);
    }
  };
}

// Send transcribed answer to Gemini AI
async function sendAnswer(answerText) {
  feedbackArea.innerHTML = '<div class="text-muted">Analyzing your response...</div>';

  try {
    const res = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: selectedQuestionId,
        answerText: answerText,
      }),
    });

    const data = await res.json();

    if (data.success) {
      feedbackArea.innerHTML = `<pre>${JSON.stringify(data.feedback, null, 2)}</pre>`;
    } else {
      feedbackArea.innerHTML = `<span class="text-danger">Error: ${data.error}</span>`;
    }
  } catch (error) {
    feedbackArea.innerHTML = `<span class="text-danger">Server error: ${error.message}</span>`;
  }
}

// Event listeners
micBtn.addEventListener('click', startRecognition);
window.onload = loadQuestions;
