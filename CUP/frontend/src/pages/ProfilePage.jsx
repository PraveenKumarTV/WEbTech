import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function ProfilePage() {
  const { user, authAxios } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const res = await authAxios.get('/api/users/profile');
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setResumeFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await authAxios.put('/api/users/profile', { name: form.name, email: form.email });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return setError('Please select a file first');
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      await authAxios.post('/api/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Resume uploaded successfully');
      setResumeFile(null);
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <h2 className="mb-4">Your Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email (cannot be changed)</Form.Label>
            <Form.Control type="email" name="email" value={form.email} disabled />
          </Form.Group>

          <Button type="submit" className="mb-4">Update Profile</Button>
        </Form>

        <hr />

        <h4>Upload / Update Resume</h4>
        <Form.Group controlId="resume" className="mb-3">
          <Form.Control type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        </Form.Group>
        <Button onClick={handleResumeUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </Card.Body>
    </Card>
  );
}
