import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Placement Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/recent-updates">Updates</Nav.Link>
            <Nav.Link as={Link} to="/company-questions">Company Questions</Nav.Link>
            <Nav.Link as={Link} to="/winning-projects">Winning Projects</Nav.Link>
            <Nav.Link as={Link} to="/mock-interview">Mock Interview</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <NavDropdown title={user.name} id="user-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  {user.isAdmin && <NavDropdown.Item as={Link} to="/admin">Admin</NavDropdown.Item>}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button variant="outline-light" className="me-2" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="light" onClick={() => navigate('/signup')}>
                  Signup
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
