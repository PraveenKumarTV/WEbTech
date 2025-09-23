import React, { useEffect, useState } from 'react';
import { Accordion, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function CompanyQuestionsPage() {
  const { authAxios } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authAxios.get('/api/questions');
      setQuestions(res.data);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q =>
    q.company.toLowerCase().includes(filter.toLowerCase()) ||
    q.question.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <h2 className="mb-4">Company-wise Interview Questions</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search companies or questions..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={() => setFilter('')}>
          Clear
        </Button>
      </InputGroup>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Accordion>
          {filteredQuestions.length === 0 && <p>No questions found.</p>}
          {filteredQuestions.map(({ _id, company, question, answer }, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={_id}>
              <Accordion.Header>{company} - Q: {question}</Accordion.Header>
              <Accordion.Body>
                <strong>Answer / Explanation:</strong>
                <p>{answer}</p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </>
  );
}
