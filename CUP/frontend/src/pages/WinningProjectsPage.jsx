import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Form, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function WinningProjectsPage() {
  const { authAxios } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);

  // Collect unique filter values from projects
  const techStacks = [...new Set(projects.map(p => p.techStack).filter(Boolean))];
  const technologies = [...new Set(projects.map(p => p.technology).filter(Boolean))];
  const domains = [...new Set(projects.map(p => p.domain).filter(Boolean))];

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

  // Helper to toggle selection
  const toggleSelection = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
  };

  // Filtering logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesTechStack =
      selectedTechStacks.length === 0 || selectedTechStacks.includes(p.techStack);

    const matchesTechnology =
      selectedTechnologies.length === 0 || selectedTechnologies.includes(p.technology);

    const matchesDomain =
      selectedDomains.length === 0 || selectedDomains.includes(p.domain);

    return matchesSearch && matchesTechStack && matchesTechnology && matchesDomain;
  });

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 0' }}>
      <h2 className="mb-4 text-center">Winning Projects</h2>
      <Row className="mb-4 align-items-center">
        <Col xs={8}>
          <Form>
            <Form.Control
              type="text"
              placeholder="Search projects by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            />
          </Form>
        </Col>
        <Col xs={4}>
          <DropdownButton id="filter-dropdown" title="Filters" variant="outline-primary" className="w-100">
            <Dropdown.Header>Tech Stack</Dropdown.Header>
            {techStacks.map(stack => (
              <Form.Check
                key={stack}
                type="checkbox"
                label={stack}
                checked={selectedTechStacks.includes(stack)}
                onChange={() => toggleSelection(stack, selectedTechStacks, setSelectedTechStacks)}
                style={{ marginLeft: '1rem' }}
              />
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>Technology</Dropdown.Header>
            {technologies.map(tech => (
              <Form.Check
                key={tech}
                type="checkbox"
                label={tech}
                checked={selectedTechnologies.includes(tech)}
                onChange={() => toggleSelection(tech, selectedTechnologies, setSelectedTechnologies)}
                style={{ marginLeft: '1rem' }}
              />
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>Domain</Dropdown.Header>
            {domains.map(domain => (
              <Form.Check
                key={domain}
                type="checkbox"
                label={domain}
                checked={selectedDomains.includes(domain)}
                onChange={() => toggleSelection(domain, selectedDomains, setSelectedDomains)}
                style={{ marginLeft: '1rem' }}
              />
            ))}
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                setSelectedTechStacks([]);
                setSelectedTechnologies([]);
                setSelectedDomains([]);
              }}
            >
              Clear Filters
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && filteredProjects.length === 0 && <p className="text-center">No projects found.</p>}

      <div>
        {filteredProjects.map(({ _id, title, description, demoLink, sourceCodeLink, imageUrl, techStack, technology, domain }) => (
          <Card key={_id} className="mb-4 shadow-sm" style={{ borderRadius: '18px', overflow: 'hidden' }}>
            {imageUrl && (
              <Card.Img
                variant="top"
                src={imageUrl}
                alt={title}
                style={{ height: '220px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <Card.Title className="mb-2">{title}</Card.Title>
              <Card.Text className="mb-2">{description}</Card.Text>
              <div style={{ fontSize: '0.95em', color: '#555' }}>
                {techStack && <span><strong>Tech Stack:</strong> {techStack} &nbsp;|&nbsp;</span>}
                {technology && <span><strong>Technology:</strong> {technology} &nbsp;|&nbsp;</span>}
                {domain && <span><strong>Domain:</strong> {domain}</span>}
              </div>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              {demoLink && (
                <Button
                  variant="outline-success"
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                >
                  Demo
                </Button>
              )}
              {sourceCodeLink && (
                <Button
                  variant="outline-primary"
                  href={sourceCodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                >
                  Source Code
                </Button>
              )}
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
