import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Form, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function WinningProjectsPage() {
  const { authAxios } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authAxios.get('http://localhost:3001/api/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2 className="mb-4">Winning Projects</h2>
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search projects by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Form>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filteredProjects.length === 0 && <p>No projects found.</p>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProjects.map(({ _id, title, description, demoLink, sourceCodeLink }) => (
          <Col key={_id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                {demoLink && (
                  <Card.Link href={demoLink} target="_blank" rel="noopener noreferrer">
                    Demo
                  </Card.Link>
                )}
                {sourceCodeLink && (
                  <Card.Link href={sourceCodeLink} target="_blank" rel="noopener noreferrer">
                    Source Code
                  </Card.Link>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
