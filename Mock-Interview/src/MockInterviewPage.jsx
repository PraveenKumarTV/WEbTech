import React, { useEffect, useState, useRef } from 'react';

function MockInterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedQuestionText, setSelectedQuestionText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [micRecording, setMicRecording] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const micBtnRef = useRef(null);
  const transcriptRef = useRef(null);

  // Load questions from backend
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('http://localhost:3000/api/questions');
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        } else {
          setQuestions([]);
          console.error('Failed to load questions.');
        }
      } catch (error) {
        setQuestions([]);
        console.error('Server error:', error);
      }
    }
    loadQuestions();
  }, []);

  // Handle question selection
  function selectQuestion(id, text) {
    setSelectedQuestionId(id);
    setSelectedQuestionText(text);
    setTranscript('');
    setFeedback(null);
  }

  // Speech recognition handler
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
    setMicRecording(true);

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      // Append or replace transcript as needed
      setTranscript((prev) => (prev ? prev + ' ' + spoken : spoken));
    };

    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
      setMicRecording(false);
    };

    recognition.onend = () => {
      setMicRecording(false);
      // Optionally auto-send after speech ends, comment out if you want manual send only
      // if (transcript.trim()) {
      //   sendAnswer(transcript);
      // }
    };
  }

  // Send answer to backend AI feedback
  async function sendAnswer(answerText) {
    if (!selectedQuestionId) return;
    setLoadingFeedback(true);
    setFeedback(null);

    try {
      const res = await fetch('http://localhost:3000/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestionId,
          answerText,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback(data.feedback);
      } else {
        setFeedback({ error: data.error });
      }
    } catch (error) {
      setFeedback({ error: error.message });
    } finally {
      setLoadingFeedback(false);
    }
  }

  // Handle manual submit button click
  function handleSubmitClick() {
    if (transcript.trim()) {
      sendAnswer(transcript.trim());
    } else {
      alert('Please enter or speak your answer before submitting.');
    }
  }

  return (
    <div className="container-fluid d-flex vh-100 p-0">
      {/* Sidebar: Questions */}
      <div id="question-list" className="col-md-3 p-4 border-end overflow-auto">
        <h5 className="fw-semibold mb-3">Interview Questions</h5>
        <ul className="list-group" id="questions-ul" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          {questions.length === 0 && <li className="text-muted">No questions available.</li>}
          {questions.map((q) => (
            <li
              key={q._id}
              className={`list-group-item ${selectedQuestionId === q._id ? 'active' : ''}`}
              onClick={() => selectQuestion(q._id, q.question)}
              style={{ cursor: 'pointer' }}
            >
              {q.question || 'Untitled Question'}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="col-md-9 d-flex flex-column p-4 gap-3">
        {/* Selected Question Display */}
        <div>
          <h4 className="text-primary-emphasis fw-semibold" id="question-title">
            {selectedQuestionText ? `📝 ${selectedQuestionText}` : 'Select a question to begin'}
          </h4>
        </div>

        {/* Card-based UI */}
        <div className="d-flex justify-content-between align-items-center card-container">
          {/* User Card */}
          <div className="card shadow-sm" style={{ width: '18rem' }}>
            <div className="card-body text-center">
              <img src="Praveen.jpeg" className="profile-img mb-2" alt="User" />
              <h6 className="card-title mb-0">You</h6>
            </div>
          </div>

          {/* Mic Button */}
          <button
            id="mic-button"
            className={`mx-4 btn btn-outline-primary ${micRecording ? 'recording' : ''}`}
            onClick={startRecognition}
            disabled={!selectedQuestionId || micRecording}
            title={micRecording ? 'Listening...' : 'Start Speaking'}
            ref={micBtnRef}
          >
            🎤
          </button>

          {/* AI Card */}
          <div className="card shadow-sm" style={{ width: '12rem' }}>
            <div className="card-body text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png"
                className="rounded-circle mb-2"
                width={60}
                alt="AI"
              />
              <h6 className="card-title mb-0">Gemini AI</h6>
            </div>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="mb-3">
          <label htmlFor="transcript" className="form-label fw-semibold">
            Your Answer (transcribed):
          </label>
          <textarea
            id="transcript"
            className="form-control"
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            ref={transcriptRef}
            placeholder="Type your answer here or use the microphone to speak..."
          ></textarea>
        </div>

        {/* Submit Answer Button */}
        <div className="mb-3">
          <button
            className="btn btn-primary"
            onClick={handleSubmitClick}
            disabled={!selectedQuestionId || loadingFeedback}
          >
            {loadingFeedback ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>

        {/* AI Feedback */}
        <div>
          <h5 className="fw-semibold">AI Feedback:</h5>
          <div
            id="feedback-area"
            className="p-3 rounded shadow-sm"
            style={{ minHeight: '100px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
          >
            {loadingFeedback && <div className="text-muted">Analyzing your response...</div>}
            {!loadingFeedback && feedback && !feedback.error && (
              <pre>{JSON.stringify(feedback, null, 2)}</pre>
            )}
            {!loadingFeedback && feedback && feedback.error && (
              <span className="text-danger">Error: {feedback.error}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewPage;
