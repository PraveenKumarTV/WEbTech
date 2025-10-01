import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  Spinner,
  Alert,
  ProgressBar,
  Row,
  Col,
  Form,
  Container,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function MockInterviewPage() {
  const { authAxios } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [isResumeBased, setIsResumeBased] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await authAxios.get('http://localhost:3001/api/mock-questions');
        setQuestions(res.data);
        setSelectedIndex(0);
        setIsResumeBased(false);
      } catch (err) {
        setError('Failed to load mock interview questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
      recognition.current.onresult = event => {
        if (event.results && event.results[0] && event.results[0][0]) {
          setAnswer(event.results[0][0].transcript);
        }
      };
      recognition.current.onerror = event => {
        setError('Speech recognition error: ' + event.error);
      };
    } else {
      recognition.current = null;
    }
  }, []);

  const startRecognition = () => {
    setError('');
    if (recognition.current) {
      try {
        recognition.current.start();
      } catch (e) {
        if (e.name === 'NotAllowedError' || (e.message && e.message.includes('not allowed'))) {
          setError('Microphone access denied. Please allow microphone permission.');
        } else {
          setError('Could not start speech recognition. Try again.');
        }
      }
    } else {
      setError('Speech recognition not supported in your browser.');
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setAnswerLoading(true);
    try {
      const res = await authAxios.post('http://localhost:3001/api/validate-answer', {
        question: currentQuestion.question,
        answer: answer.trim()
      });

      const feedbackFromAI = res.data?.feedback || 'No feedback received.';
      setFeedback(feedbackFromAI);
    } catch (err) {
      console.error(err);
      setFeedback('Failed to get feedback from AI. Try again.');
    }
    setAnswer('');
    setAnswerLoading(false);
  };

  const handleResumeChange = e => {
    setResumeFile(e.target.files[0]);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setResumeLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await authAxios.post('http://localhost:3001/api/resume-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setQuestions(res.data);
      setSelectedIndex(0);
      setIsResumeBased(true);
      setFeedback('📄 Questions generated from resume!');
    } catch (err) {
      setError('Failed to generate questions from resume');
    } finally {
      setResumeLoading(false);
    }
  };

  const currentQuestion = questions[selectedIndex] || {};

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar - only visible for default questions */}
        {!isResumeBased && (
          <Col md={3} className="border-end bg-light p-3">
            <h5 className="mb-3">Questions</h5>
            {questions.length === 0 ? (
              <p>No questions available.</p>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={q._id || idx}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setFeedback('');
                    setAnswer('');
                  }}
                  style={{
                    padding: '10px',
                    backgroundColor: selectedIndex === idx ? '#007bff' : '#fff',
                    color: selectedIndex === idx ? '#fff' : '#000',
                    borderRadius: '5px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    border: '1px solid #ddd'
                  }}
                >
                  {q.question}
                </div>
              ))
            )}

            <hr />

            <Form.Group controlId="resumeUpload">
              <Form.Label className="fw-bold">Upload Resume (PDF/DOC)</Form.Label>
              <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
            </Form.Group>
            <Button
              className="mt-2 w-100"
              onClick={handleResumeUpload}
              disabled={resumeLoading || !resumeFile}
            >
              {resumeLoading ? 'Generating...' : 'Generate from Resume'}
            </Button>
          </Col>
        )}

        {/* Main Content */}
        <Col md={isResumeBased ? { span: 8, offset: 2 } : 9} className="p-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">🧠 Mock Interview</h4>
              {error && <Alert variant="danger">{error}</Alert>}

              {selectedIndex !== null && currentQuestion ? (
                <>
                  <p><strong>Question {selectedIndex + 1}:</strong> {currentQuestion.question}</p>

                  <Button variant="outline-primary" onClick={startRecognition} className="mb-3">
                    🎤 Speak Your Answer
                  </Button>

                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Type your answer or speak..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />

                  <p><em>Your Answer:</em> {answer}</p>

                  <div className="d-flex align-items-center gap-3">
                    <Button onClick={submitAnswer} disabled={!answer.trim() || answerLoading}>
                      {answerLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Submitting...
                        </>
                      ) : (
                        'Submit Answer'
                      )}
                    </Button>
                    {feedback && (
                      <Alert className="mb-0" variant={feedback.includes('Good') ? 'success' : 'warning'}>
                        {feedback}
                      </Alert>
                    )}
                  </div>

                  {/* Navigation for resume-based questions */}
                  {isResumeBased && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <Button
                        variant="secondary"
                        disabled={selectedIndex === 0}
                        onClick={() => {
                          setSelectedIndex(i => i - 1);
                          setFeedback('');
                          setAnswer('');
                        }}
                      >
                        ⬅ Previous
                      </Button>
                      <div>
                        Question {selectedIndex + 1} of {questions.length}
                      </div>
                      <Button
                        variant="secondary"
                        disabled={selectedIndex === questions.length - 1}
                        onClick={() => {
                          setSelectedIndex(i => i + 1);
                          setFeedback('');
                          setAnswer('');
                        }}
                      >
                        Next ➡
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p>Select a question to begin.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
