import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4">Welcome to the Placement Preparation Portal</h1>
      <p>
        Prepare for campus and company placements efficiently with curated resources, mock interviews, and community projects.
      </p>
      <Row className="mt-4 g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Signup / Login</Card.Title>
              <Card.Text>Create your account or login to access personalized features.</Card.Text>
              <Link to="/signup" className="btn btn-primary me-2">Signup</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Recent Updates</Card.Title>
              <Card.Text>Stay updated with the latest placement news and trends.</Card.Text>
              <Link to="/recent-updates" className="btn btn-primary">View Updates</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Company-wise Questions</Card.Title>
              <Card.Text>Practice interview questions categorized by companies.</Card.Text>
              <Link to="/company-questions" className="btn btn-primary">Explore Questions</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Winning Projects</Card.Title>
              <Card.Text>Browse projects submitted by users that helped in placements.</Card.Text>
              <Link to="/winning-projects" className="btn btn-primary">Browse Projects</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Mock Interviews</Card.Title>
              <Card.Text>Practice with curated mock interview questions to boost your confidence.</Card.Text>
              <Link to="/mock-interview" className="btn btn-primary">Start Mock Interview</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
