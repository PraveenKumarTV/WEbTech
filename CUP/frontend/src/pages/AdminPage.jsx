import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminPage() {
  const { user, authAxios } = useAuth();
  const [key, setKey] = useState('questions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [questions, setQuestions] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [mockQuestions, setMockQuestions] = useState([]);

  // Modal management for adding/editing
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null); // For editing
  const [modalType, setModalType] = useState(''); // 'questions' | 'updates' | 'projects' | 'mockQuestions'
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [qRes, uRes, pRes, mRes] = await Promise.all([
          authAxios.get('/api/questions'),
          authAxios.get('/api/updates'),
          authAxios.get('/api/projects'),
          authAxios.get('/api/mock-questions'),
        ]);
        setQuestions(qRes.data);
        setUpdates(uRes.data);
        setProjects(pRes.data);
        setMockQuestions(mRes.data);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user?.isAdmin) {
    return <Alert variant="danger">Access denied. Admins only.</Alert>;
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await authAxios.delete(`/api/${type}/${id}`);
      // Refresh data
      if (type === 'questions') setQuestions(q => q.filter(q => q._id !== id));
      if (type === 'updates') setUpdates(u => u.filter(u => u._id !== id));
      if (type === 'projects') setProjects(p => p.filter(p => p._id !== id));
      if (type === 'mock-questions') setMockQuestions(m => m.filter(m => m._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setModalData(item);
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
    setModalType('');
  };

  const handleModalChange = (e) => {
    setModalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalSubmit = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      if (modalData._id) {
        // Update
        await authAxios.put(`/api/${modalType}/${modalData._id}`, modalData);
      } else {
        // Create
        await authAxios.post(`/api/${modalType}`, modalData);
      }

      // Refresh list
      switch (modalType) {
        case 'questions':
          const qRes = await authAxios.get('/api/questions');
          setQuestions(qRes.data);
          break;
        case 'updates':
          const uRes = await authAxios.get('/api/updates');
          setUpdates(uRes.data);
          break;
        case 'projects':
          const pRes = await authAxios.get('/api/projects');
          setProjects(pRes.data);
          break;
        case 'mock-questions':
          const mRes = await authAxios.get('/api/mock-questions');
          setMockQuestions(mRes.data);
          break;
      }

      closeModal();
    } catch (err) {
      setModalError('Save failed');
    } finally {
      setModalLoading(false);
    }
  };

  const renderList = (items, type, fields) => (
    <>
      <Button className="mb-3" onClick={() => openModal(type, {})}>
        Add New
      </Button>
      {items.length === 0 && <p>No items found.</p>}
      {items.map(item => (
        <div key={item._id} className="border rounded p-3 mb-3">
          {fields.map(f => (
            <p key={f.key}>
              <strong>{f.label}:</strong> {item[f.key]}
            </p>
          ))}
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            onClick={() => openModal(type, item)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(type, item._id)}
          >
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
        <Tabs activeKey={key} onSelect={setKey} className="mb-3">
          <Tab eventKey="questions" title="Questions">
            {renderList(questions, 'questions', [
              { key: 'company', label: 'Company' },
              { key: 'question', label: 'Question' },
              { key: 'answer', label: 'Answer' },
            ])}
          </Tab>
          <Tab eventKey="updates" title="Updates">
            {renderList(updates, 'updates', [
              { key: 'content', label: 'Content' },
            ])}
          </Tab>
          <Tab eventKey="projects" title="Projects">
            {renderList(projects, 'projects', [
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'demoLink', label: 'Demo Link' },
              { key: 'sourceCodeLink', label: 'Source Code Link' },
            ])}
          </Tab>
          <Tab eventKey="mock-questions" title="Mock Questions">
            {renderList(mockQuestions, 'mock-questions', [
              { key: 'question', label: 'Question' },
              { key: 'answer', label: 'Answer' },
            ])}
          </Tab>
        </Tabs>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData?._id ? 'Edit' : 'Add'} {modalType.replace('-', ' ')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {modalType === 'questions' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  name="company"
                  value={modalData?.company || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  name="question"
                  value={modalData?.question || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="answer"
                  value={modalData?.answer || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </>
          )}
          {modalType === 'updates' && (
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={modalData?.content || ''}
                onChange={handleModalChange}
              />
            </Form.Group>
          )}
          {modalType === 'projects' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  value={modalData?.title || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={modalData?.description || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Demo Link</Form.Label>
                <Form.Control
                  name="demoLink"
                  value={modalData?.demoLink || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Source Code Link</Form.Label>
                <Form.Control
                  name="sourceCodeLink"
                  value={modalData?.sourceCodeLink || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </>
          )}
          {modalType === 'mock-questions' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  name="question"
                  value={modalData?.question || ''}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="answer"
                  value={modalData?.answer || ''}
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
