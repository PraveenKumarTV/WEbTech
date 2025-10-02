// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('mock-questions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [mockQuestions, setMockQuestions] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // either 'mock-questions' or 'projects'
  const [modalData, setModalData] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Fetch data on mount or when activeTab changes
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [mqRes, pjRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/mock-questions'),
        axios.get('http://localhost:3001/api/admin/projects'),
      ]);
      setMockQuestions(mqRes.data);
      setProjects(pjRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = {}) => {
    setModalType(type);
    setModalData(item);
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({});
    setModalType('');
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSubmit = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      if (modalData._id) {
        // Update
        await axios.put(`http://localhost:3001/api/admin/${modalType}/${modalData._id}`, modalData);
      } else {
        // Create
        await axios.post(`http://localhost:3001/api/admin/${modalType}`, modalData);
      }
      // Refresh lists
      await fetchAll();
      closeModal();
    } catch (err) {
      console.error('Modal submit error', err);
      setModalError('Save failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/admin/${type}/${id}`);
      // Refresh
      await fetchAll();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const renderMockQuestions = () => (
    <>
      <Button className="mb-3" onClick={() => openModal('mock-questions', {})}>
        Add Mock Question
      </Button>
      {mockQuestions.length === 0 && <p>No mock questions found.</p>}
      {mockQuestions.map(q => (
        <div key={q._id} className="border rounded p-3 mb-3">
          <p><strong>Question:</strong> {q.question}</p>
          <p><strong>Answer:</strong> {q.answer}</p>
          <Button variant="warning" size="sm" className="me-2" onClick={() => openModal('mock-questions', q)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete('mock-questions', q._id)}>
            Delete
          </Button>
        </div>
      ))}
    </>
  );

  const renderProjects = () => (
    <>
      <Button className="mb-3" onClick={() => openModal('projects', {})}>
        Add Project
      </Button>
      {projects.length === 0 && <p>No projects found.</p>}
      {projects.map(prj => (
        <div key={prj._id} className="border rounded p-3 mb-3">
          <p><strong>Name:</strong> {prj.name}</p>
          <p><strong>Description:</strong> {prj.description}</p>
          <p><strong>Demo Link:</strong> {prj.demoLink}</p>
          <p><strong>Source Code:</strong> {prj.sourceCode}</p>
          <Button variant="warning" size="sm" className="me-2" onClick={() => openModal('projects', prj)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete('projects', prj._id)}>
            Delete
          </Button>
        </div>
      ))}
    </>
  );

  return (
    <>
      <h2 className="mb-4">Admin Panel</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Tabs
          activeKey={activeTab}
          onSelect={k => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="mock-questions" title="Mock Interview Questions">
            {renderMockQuestions()}
          </Tab>
          <Tab eventKey="projects" title="Winning Projects">
            {renderProjects()}
          </Tab>
        </Tabs>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData._id ? 'Edit' : 'Add'}{' '}
            {modalType === 'mock-questions' ? 'Mock Question' : 'Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}

          {modalType === 'mock-questions' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  name="question"
                  value={modalData.question || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="answer"
                  value={modalData.answer || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </>
          )}

          {modalType === 'projects' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  name="name"
                  value={modalData.name || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={modalData.description || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Demo Link</Form.Label>
                <Form.Control
                  name="demoLink"
                  value={modalData.demoLink || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Source Code</Form.Label>
                <Form.Control
                  name="sourceCode"
                  value={modalData.sourceCode || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={modalLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit} disabled={modalLoading}>
            {modalLoading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
