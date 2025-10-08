import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search, User, Target, ChevronDown, Menu, X } from 'lucide-react';
import './Navbar.css'; // custom CSS for shadows, hover, etc.

export default function NavbarComponent() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock user data
  const user = { name: 'John Doe', isAdmin: true };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/login');
  };

  return (
    <>
      <header className={`navbar fixed-top ${scrolled ? 'navbar-scrolled shadow-sm' : 'navbar-light'}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center px-3 py-2">
          {/* Logo Section */}
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <div className="logo-icon d-flex align-items-center justify-content-center me-2">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h1 className="h5 mb-0 text-dark">Placement Prep Portal</h1>
              <small className="text-muted d-none d-sm-block">Your success journey starts here</small>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center">
            <nav className="nav me-3">
              <Link to="/recent-updates" className="nav-link text-dark">Updates</Link>
              <Link to="/company-questions" className="nav-link text-dark">Questions</Link>
              <Link to="/winning-projects" className="nav-link text-dark">Projects</Link>
              <Link to="/mock-interview" className="nav-link text-dark">Mock Interview</Link>
            </nav>

            <div className="d-flex align-items-center border-start ps-3">
              <button className="btn position-relative me-2" aria-label="Notifications">
                <Bell size={20} />
                <span className="notification-badge"></span>
              </button>

              <button className="btn me-3" aria-label="Search">
                <Search size={20} />
              </button>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="avatar me-2">{user.name.charAt(0)}</div>
                    <span className="me-1">{user.name}</span>
                    <ChevronDown className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} size={16} />
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu show dropdown-menu-end shadow-sm">
                      <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                      {user.isAdmin && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Admin Dashboard</Link>
                      )}
                      <button
                        className="dropdown-item text-danger d-flex align-items-center"
                        onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                      >
                        <LogOut size={16} className="me-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-dark" onClick={() => navigate('/login')}>Login</button>
                  <button className="btn btn-primary" onClick={() => navigate('/signup')}>Signup</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="btn d-lg-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu bg-white shadow-sm">
          <nav className="d-flex flex-column px-3 py-3">
            <Link to="/recent-updates" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Updates</Link>
            <Link to="/company-questions" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Company Questions</Link>
            <Link to="/winning-projects" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Winning Projects</Link>
            <Link to="/mock-interview" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Mock Interview</Link>
          </nav>

          {user ? (
            <div className="px-3 pt-2 border-top">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar me-2">{user.name.charAt(0)}</div>
                <span className="fw-bold">{user.name}</span>
              </div>
              <Link to="/profile" className="d-block mb-1" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              {user.isAdmin && (
                <Link to="/admin" className="d-block mb-1" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <button className="btn btn-dark w-100 mt-2" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                <LogOut size={16} className="me-2" /> Logout
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column px-3 pt-2 border-top gap-2">
              <button className="btn btn-outline-dark w-100" onClick={() => { setIsMenuOpen(false); navigate('/login'); }}>Login</button>
              <button className="btn btn-primary w-100" onClick={() => { setIsMenuOpen(false); navigate('/signup'); }}>Signup</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
