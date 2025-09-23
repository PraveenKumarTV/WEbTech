import React, { useEffect, useState } from 'react';
import { Alert, Spinner, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function RecentUpdatesPage() {
  const { user, authAxios } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUpdates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authAxios.get('/api/updates');
      setUpdates(res.data);
    } catch (err) {
      setError('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) return setModalError('Update content is required');
    setModalLoading(true);
    setModalError('');
    try {
      await authAxios.post('/api/updates', { content: newUpdate });
      setShowModal(false);
      setNewUpdate('');
      fetchUpdates();
    } catch (err) {
      setModalError('Failed to add update');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
      await authAxios.delete(`/api/updates/${id}`);
      fetchUpdates();
    } catch {
      alert('Failed to delete update');
    }
  };

  return (
    <>
      <h2 className="mb-4">Recent Updates</h2>
      {user?.isAdmin && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          Add New Update
        </Button>
      )}

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <ListGroup>
          {updates.length === 0 && <p>No updates available.</p>}
          {updates.map(({ _id, content, createdAt }) => (
            <ListGroup.Item key={_id} className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">{new Date(createdAt).toLocaleString()}</small>
                <p>{content}</p>
              </div>
              {user?.isAdmin && (
                <Button variant="danger" size="sm" onClick={() => handleDelete(_id)}>
                  Delete
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form.Control
            as="textarea"
            rows={4}
            value={newUpdate}
            onChange={e => setNewUpdate(e.target.value)}
            placeholder="Enter update content here"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUpdate} disabled={modalLoading}>
            {modalLoading ? 'Adding...' : 'Add Update'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
