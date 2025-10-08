import React, { useEffect, useState } from 'react';
import {
  Card,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  Container,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './WinningProjectsPage.css'; // Import the CSS file

export default function WinningProjectsPage() {
  const { authAxios } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await authAxios.get('http://localhost:3001/api/admin/projects');
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [authAxios]);

  // Collect unique values
  const techStacks = [...new Set(projects.map(p => p.techStack).filter(Boolean))];
  const technologies = [...new Set(projects.map(p => p.technology).filter(Boolean))];
  const domains = [...new Set(projects.map(p => p.domain).filter(Boolean))];

  const toggleSelection = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      (project?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (project?.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesTechStack =
      selectedTechStacks.length === 0 || selectedTechStacks.includes(project?.techStack);

    const matchesTechnology =
      selectedTechnologies.length === 0 || selectedTechnologies.includes(project?.technology);

    const matchesDomain =
      selectedDomains.length === 0 || selectedDomains.includes(project?.domain);

    return matchesSearch && matchesTechStack && matchesTechnology && matchesDomain;
  });

  return (
    <div className="winning-projects-wrapper">
      <Container style={{ maxWidth: '700px' }}>
        <h2 className="mb-4 text-center">Winning Projects</h2>

        <Row className="mb-4 align-items-center">
          <Col xs={8}>
            <Form.Control
              type="text"
              placeholder="Search projects by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col xs={4}>
            <DropdownButton
              id="filter-dropdown"
              title="Filters"
              variant="outline-primary"
              className="w-100"
            >
              <Dropdown.Header>Tech Stack</Dropdown.Header>
              {techStacks.map(stack => (
                <Form.Check
                  key={stack}
                  type="checkbox"
                  label={stack}
                  checked={selectedTechStacks.includes(stack)}
                  onChange={() => toggleSelection(stack, selectedTechStacks, setSelectedTechStacks)}
                  className="dropdown-checkbox"
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
                  onChange={() =>
                    toggleSelection(tech, selectedTechnologies, setSelectedTechnologies)
                  }
                  className="dropdown-checkbox"
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
                  className="dropdown-checkbox"
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
        {!loading && !error && filteredProjects.length === 0 && (
          <p className="text-center">No projects found.</p>
        )}

        <div>
          {filteredProjects.map(
            ({
              _id,
              title,
              description,
              demoLink,
              sourceCodeLink,
              imageUrl,
              techStack,
              technology,
              domain,
            }) => (
              <Card key={_id} className="mb-4 shadow-sm project-card">
                {imageUrl && (
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={title}
                    className="project-image"
                  />
                )}
                <Card.Body>
                  <Card.Title className="mb-2">{title}</Card.Title>
                  <Card.Text className="mb-2">{description}</Card.Text>
                  <div className="project-tags">
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
            )
          )}
        </div>
      </Container>
    </div>
  );
}
