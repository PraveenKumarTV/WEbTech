import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Spinner, Alert, ProgressBar, ListGroup, Row, Col, Form } from 'react-bootstrap';
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
  const recognition = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await authAxios.get('http://localhost:3001/api/mock-questions');
        setQuestions(res.data);
        setSelectedIndex(0); // Select first question by default
      } catch (err) {
        setError('Failed to load mock interview questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();

    // Setup speech recognition
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
          setError('Microphone access denied. Please allow microphone permission in your browser settings.');
        } else {
          setError('Could not start speech recognition. Try again.');
        }
      }
    } else {
      setError('Speech recognition not supported in your browser.');
    }
  };

  const submitAnswer = () => {
    // For demo, simple check: if answer length > 10, score +1
    if (answer.trim().length > 10) {
      setScore(prev => prev + 1);
      setFeedback('Good answer!');
    } else {
      setFeedback('Try to elaborate more.');
    }
    setAnswer('');
  };

  const handleResumeChange = (e) => {
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
      setFeedback('Questions generated from resume!');
    } catch (err) {
      setError('Failed to generate questions from resume');
    } finally {
      setResumeLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Row>
      <Col md={3} className="border-end" style={{ minHeight: '80vh' }}>
        <h5 className="mt-3">Questions</h5>
        <ListGroup>
          {questions.length === 0 && <ListGroup.Item>No questions available.</ListGroup.Item>}
          {questions.map((q, idx) => (
            <ListGroup.Item
              key={q._id || idx}
              active={selectedIndex === idx}
              onClick={() => { setSelectedIndex(idx); setFeedback(''); setAnswer(''); }}
              style={{ cursor: 'pointer' }}
            >
              {q.question}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="mt-4">
          <Form.Group controlId="resumeUpload">
            <Form.Label>Upload Resume (PDF/DOC)</Form.Label>
            <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
          </Form.Group>
          <Button
            className="mt-2"
            onClick={handleResumeUpload}
            disabled={resumeLoading || !resumeFile}
          >
            {resumeLoading ? 'Generating...' : 'Generate Questions from Resume'}
          </Button>
        </div>
      </Col>
      <Col md={9} className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <Card.Body>
            <h4>Mock Interview</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {selectedIndex !== null && questions[selectedIndex] ? (
              <>
                <p><strong>Question {selectedIndex + 1}:</strong> {questions[selectedIndex].question}</p>
                <Button variant="outline-primary" onClick={startRecognition} className="mb-3">
                  🎤 Speak Your Answer
                </Button>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your answer here or use speech..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                </div>
                <p><em>Your Answer:</em> {answer}</p>
                <Button onClick={submitAnswer} disabled={!answer.trim()}>
                  Submit Answer
                </Button>
                {feedback && <Alert className="mt-3" variant={feedback.includes('Good') ? 'success' : 'warning'}>
                  {feedback}
                </Alert>}
              </>
            ) : (
              <p>Select a question from the sidebar.</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
