import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, InputGroup, Form, ListGroup, CloseButton } from 'react-bootstrap';

// Inline SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// Helper function to convert Google Drive link
const getEmbedLink = (originalLink) => {
  if (!originalLink || originalLink === '#') return '#';
  try {
    const fileId = new URL(originalLink).pathname.split('/')[3];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  } catch (e) {
    console.error("Invalid Google Drive link:", originalLink);
    return '';
  }
};

// --- Data ---
const COMPANIES_DATA = [
  {
    name: 'Google',
    logo: 'https://placehold.co/80x80/FFFFFF/4285F4?text=G&font=roboto',
    rounds: [
      { name: 'Round 1: Online Coding Assessment', description: 'Two algorithmic problems on a coding platform. Typically 60-90 minutes.' },
      { name: 'Round 2: Technical Phone Screen', description: '45-minute call with a Google engineer covering data structures and algorithms.' },
      { name: 'Round 3-5: On-site Loop', description: 'Series of 3-4 technical interviews focusing on coding, algorithms, and system design, plus one behavioral interview.' },
    ],
    experiences: [
      {
        title: 'Software Engineer Experience',
        link: getEmbedLink('https://drive.google.com/file/d/1ye2GftvskrN-fPQNsFi_ECV6OGYyF2_g/preview'),
      },
      {
        title: 'Product Role Experience',
        link: getEmbedLink('https://docs.google.com/document/d/1p5gx7jDk8a_4paxcZn1d52F942f-yMpn/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
    ]
  },
  {
    name: 'Amazon',
    logo: 'https://placehold.co/80x80/FF9900/000000?text=A&font=roboto',
    rounds: [
      { name: 'Round 1: Online Assessment', description: 'Coding challenges and work-style simulation assessing Leadership Principles.' },
      { name: 'Round 2: Technical Phone Screen', description: 'Problem-solving session on core CS concepts.' },
      { name: 'Round 3: Virtual On-site Loop', description: '3-4 interviews covering coding, system design, and Leadership Principles.' },
    ],
    experiences: [
      {
        title: 'SDE-1 (Frontend) Experience',
        link: getEmbedLink('https://docs.google.com/document/d/1_5T7f82YhLgY0eUtdcctyRENm-Z2lqAW/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
      {
        title: 'Cloud Support Associate Experience',
        link: getEmbedLink('https://docs.google.com/document/d/1d1T4YlFm-1LXPASs-F3kRrL-hG5YVz-E/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
    ]
  },
  {
    name: 'Microsoft',
    logo: 'https://placehold.co/80x80/F2F2F2/0078D4?text=M&font=roboto',
    rounds: [
      { name: 'Round 1: Recruiter Connect', description: 'Initial screening call.' },
      { name: 'Round 2: Online Assessment', description: 'Coding challenge or 1-hour technical screen.' },
      { name: 'Round 3: Virtual On-site Loop', description: 'Typically 4 interviews covering coding, design, and behavioral aspects.' },
    ],
    experiences: [
      {
        title: 'Software Engineer Experience',
        link: getEmbedLink('https://docs.google.com/document/d/1BdaE122M2h42t_s4t22Qj8j-IeysO3s2Wz2-PRADvC0/edit?usp=sharing'),
      },
    ]
  },
  {
    name: 'Accenture',
    logo: 'https://placehold.co/80x80/FFFFFF/A100FF?text=A&font=roboto',
    rounds: [
      { name: 'Round 1: Cognitive Assessment', description: 'Online test covering aptitude, logical reasoning, and basic coding.' },
      { name: 'Round 2: Coding Assessment', description: 'Platform-based coding challenges.' },
      { name: 'Round 3: Communication Assessment', description: 'Automated test for speaking and listening skills.' },
      { name: 'Round 4: HR Interview', description: 'Behavioral questions and role fit discussion.' },
    ],
    experiences: [
      {
        title: 'Associate Software Engineer Experience',
        link: getEmbedLink('https://docs.google.com/document/d/16B-k_31Y3c-PUDhW3j11f-B8l-fKz_e-/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
    ],
  },
  {
    name: 'Capgemini',
    logo: 'https://placehold.co/80x80/0070AD/FFFFFF?text=C&font=roboto',
    rounds: [
      { name: 'Round 1: Technical Assessment', description: 'MCQs on data structures and logic.' },
      { name: 'Round 2: Game Based Test', description: 'Gamified challenges for problem-solving.' },
      { name: 'Round 3: Behavioral Profiling', description: 'Psychometric test for work style assessment.' },
      { name: 'Round 4: HR Interview', description: 'Final behavioral and fit interview.' },
    ],
    experiences: [
      {
        title: 'Analyst Role Experience',
        link: getEmbedLink('https://docs.google.com/document/d/15lU1p6gP2O_sI0-hM5hE-w-qg3rJt_Lw/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
    ],
  },
  {
    name: 'Wipro',
    logo: 'https://placehold.co/80x80/34B3EB/FFFFFF?text=W&font=roboto',
    rounds: [
      { name: 'Round 1: Online Assessment', description: 'Aptitude, reasoning, verbal, and coding sections.' },
      { name: 'Round 2: Technical Interview', description: 'Discussion on projects and CS fundamentals.' },
      { name: 'Round 3: HR Interview', description: 'Behavioral questions and career goals.' },
    ],
    experiences: [
      {
        title: 'Project Engineer Experience',
        link: getEmbedLink('https://docs.google.com/document/d/13R-eUa1_sV1mJmO-p7C-NfO-iF-Qe_xN/edit?usp=sharing&ouid=113843588927827233261&rtpof=true&sd=true'),
      },
    ]
  },
  {
    name: 'Zoho',
    logo: 'https://placehold.co/80x80/E42525/FFFFFF?text=Z&font=roboto',
    rounds: [
      { name: 'Round 1: Written Test', description: 'Offline aptitude and C programming.' },
      { name: 'Round 2 & 3: Basic Coding', description: 'In-person coding rounds on patterns and algorithms.' },
      { name: 'Round 4: System Design', description: 'Design a system with given constraints using OOPS.' },
      { name: 'Round 5: Technical Interview', description: 'Resume discussion and code optimization.' },
      { name: 'Round 6: HR Interview', description: 'Company goals and role fit discussion.' },
    ],
    experiences: [
      { title: 'Placement Drive Experience', link: '#' },
    ],
  },
  {
    name: 'Trimble',
    logo: 'https://placehold.co/80x80/F2A900/000000?text=T&font=roboto',
    rounds: [
      { name: 'Round 1: Aptitude + Coding', description: 'Offline HackerEarth test.' },
      { name: 'Round 2: Technical Interview', description: 'Projects, DSA, OOPS, OS, and DBMS.' },
      { name: 'Round 3: Managerial Interview', description: 'Scenario-based and project discussion.' },
      { name: 'Round 4: HR Round', description: 'Non-technical fit assessment.' },
    ],
    experiences: [
      { title: 'Graduate Technical Intern (Vishal)', link: '#' },
      { title: 'Graduate Technical Intern (Prasidha)', link: '#' },
      { title: 'Graduate Technical Intern (Roshan)', link: '#' },
    ],
  },
];

export default function CompanyQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalState, setModalState] = useState('closed'); // 'closed', 'company', 'rounds', 'experiences', 'viewer'
  const [selectedExperience, setSelectedExperience] = useState(null);

  const filteredCompanies = [...COMPANIES_DATA]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(company => company.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setModalState('company');
  };
  
  const openExperienceViewer = (experience) => {
    if (experience.link === '#') {
      alert('This experience document is not yet available.');
      return;
    }
    setSelectedExperience(experience);
    setModalState('viewer');
  };

  const closeAllModals = () => {
    setModalState('closed');
    // Delay clearing data to allow for smoother exit animation
    setTimeout(() => {
        setSelectedCompany(null);
        setSelectedExperience(null);
    }, 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (modalState === 'viewer') {
          setModalState('experiences');
        } else if (modalState === 'rounds' || modalState === 'experiences') {
          setModalState('company');
        } else if (modalState === 'company') {
          closeAllModals();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalState]);
  
  const renderModalContent = () => {
    if (!selectedCompany) return null;

    switch (modalState) {
      case 'company':
        return (
          <Modal show={modalState === 'company'} onHide={closeAllModals} centered>
            <Modal.Header closeButton>
                <Modal.Title as="h5">
                    <img src={selectedCompany.logo} alt={selectedCompany.name} className="d-inline-block me-3" style={{width: '40px', height: '40px', borderRadius: '50%'}}/>
                    {selectedCompany.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <p className="text-muted mb-4">Select what you'd like to explore.</p>
              <Row>
                <Col>
                  <Button variant="primary" size="lg" className="w-100" onClick={() => setModalState('rounds')}>
                    Interview Rounds
                  </Button>
                </Col>
                <Col>
                  <Button variant="success" size="lg" className="w-100" onClick={() => setModalState('experiences')}>
                    Interview Experiences
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        );
      
      case 'rounds':
        return (
            <Modal show={modalState === 'rounds'} onHide={() => setModalState('company')} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedCompany.name} - Interview Rounds</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="link" onClick={() => setModalState('company')} className="mb-3 p-0 d-flex align-items-center">
                        <ChevronLeftIcon /> Back
                    </Button>
                    <ListGroup variant="flush">
                        {selectedCompany.rounds.map((round, idx) => (
                            <ListGroup.Item key={idx} className="border-bottom-0">
                                <div className="fw-bold">{idx + 1}. {round.name}</div>
                                <p className="text-muted mb-0 ms-4">{round.description}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        );

      case 'experiences':
        return (
            <Modal show={modalState === 'experiences'} onHide={() => setModalState('company')} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedCompany.name} - Interview Experiences</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="link" onClick={() => setModalState('company')} className="mb-3 p-0 d-flex align-items-center">
                         <ChevronLeftIcon /> Back
                    </Button>
                    <ListGroup>
                        {selectedCompany.experiences.map((exp, idx) => (
                            <ListGroup.Item
                                key={idx}
                                action
                                onClick={() => openExperienceViewer(exp)}
                                disabled={exp.link === '#'}
                            >
                                <FileTextIcon /> <span className="ms-2">{exp.title}</span>
                                {exp.link === '#' && <small className="text-danger ms-2">(Link not available)</small>}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        );

      case 'viewer':
        return (
            <Modal show={modalState === 'viewer'} onHide={() => setModalState('experiences')} fullscreen={true}>
                <Modal.Header>
                     <Button variant="light" onClick={() => setModalState('experiences')} className="me-3">
                         <ChevronLeftIcon /> Back
                    </Button>
                    <Modal.Title as="h6">{selectedExperience.title}</Modal.Title>
                    <CloseButton className="ms-auto" onClick={closeAllModals} />
                </Modal.Header>
                <Modal.Body style={{ padding: 0, overflow: 'hidden' }}>
                    <iframe
                        src={selectedExperience.link}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={selectedExperience.title}
                    />
                </Modal.Body>
            </Modal>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
        <Container className="py-5">
            <header className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark">
                Fresher Interview Hub
            </h1>
            <p className="text-muted fs-5">
                Explore interview experiences and round details from top companies.
            </p>
            </header>

            <Row className="justify-content-center mb-5">
                <Col md={8} lg={6}>
                    <InputGroup>
                    <InputGroup.Text><SearchIcon /></InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: '0 50rem 50rem 0' }}
                    />
                    </InputGroup>
                </Col>
            </Row>

            <Row xs={2} md={3} lg={4} xl={5} className="g-4">
            {filteredCompanies.map((company) => (
                <Col key={company.name}>
                    <Card 
                        onClick={() => handleCompanyClick(company)} 
                        className="h-100 text-center shadow-sm" 
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'; }}
                    >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="rounded-circle mb-3"
                                style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #eee' }}
                                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Logo'; }}
                            />
                            <Card.Title className="mb-0 fs-6">{company.name}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>

            {filteredCompanies.length === 0 && (
            <p className="text-center text-muted mt-5">No companies found.</p>
            )}
        </Container>
        {renderModalContent()}
    </div>
  );
}

