import React, { useState, useEffect } from 'react';
import { LogOut, TrendingUp, BookOpen, Code, Users, Award, Clock, ChevronRight, Target, Bell, Search, User } from 'lucide-react';
import './HomePage.css'; // custom CSS for shadows and hover effects

function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updates = [
    { id: 1, title: 'Google Off-Campus Drive 2025', description: 'Applications open for Software Engineering roles. Last date: Nov 15', date: '2 hours ago', type: 'placement', color: 'bg-warning' },
    { id: 2, title: 'Microsoft Hiring for SDE-1', description: 'Campus recruitment drive scheduled for December 2025', date: '5 hours ago', type: 'placement', color: 'bg-primary' },
    { id: 3, title: 'New Mock Interview Series Added', description: 'Practice with real interview questions from FAANG companies', date: '1 day ago', type: 'news', color: 'bg-success' },
    { id: 4, title: 'Hackathon Winners Announced', description: 'Check out the winning projects from our recent hackathon', date: '2 days ago', type: 'event', color: 'bg-purple' }
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header className={`navbar fixed-top ${scrolled ? 'navbar-scrolled shadow-sm' : 'bg-white border-bottom'}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center px-3 py-2">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <div className="logo-icon d-flex align-items-center justify-content-center me-2">
              <Target size={24} className="text-white"/>
            </div>
            <div>
              <h1 className="h5 mb-0 text-dark">Placement Prep Portal</h1>
              <small className="text-muted">Your success journey starts here</small>
            </div>
          </div>

          {/* Navigation */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <nav className="nav me-3">
              <a href="#" className="nav-link text-dark">Updates</a>
              <a href="#" className="nav-link text-dark">Questions</a>
              <a href="#" className="nav-link text-dark">Projects</a>
              <a href="#" className="nav-link text-dark">Mock Interview</a>
            </nav>

            <div className="d-flex align-items-center border-start ps-3 gap-2">
              <button className="btn position-relative">
                <Bell size={20}/>
                <span className="notification-badge"></span>
              </button>
              <button className="btn">
                <Search size={20}/>
              </button>
              <button className="btn">
                <User size={20}/>
              </button>
              <button className="btn btn-dark d-flex align-items-center gap-2">
                <LogOut size={16}/> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-5 mt-5 py-5 bg-light text-center">
        <div className="container">
          <div className="badge bg-success text-white rounded-pill mb-3 px-3 py-2 shadow-custom border-dark d-inline-block">
            ✨ Trusted by 50,000+ Students
          </div>
          <h2 className="display-4 fw-bold mb-3">Master Your <span className="text-primary">Placement Journey</span></h2>
          <p className="lead text-muted mb-5">
            Your comprehensive platform for campus placements with curated resources, real interview questions, and winning project ideas from top companies.
          </p>

          {/* Stats */}
          <div className="row justify-content-center g-4">
            {[
              { number: '500+', label: 'Companies', icon: Target, color: 'text-primary', bg: 'bg-primary-light' },
              { number: '10K+', label: 'Questions', icon: BookOpen, color: 'text-purple', bg: 'bg-purple-light' },
              { number: '95%', label: 'Success Rate', icon: Award, color: 'text-success', bg: 'bg-success-light' }
            ].map((stat, idx) => (
              <div key={idx} className="col-md-3">
                <div className="card shadow-custom hover-shadow p-4 border-dark rounded">
                  <div className={`icon-wrapper ${stat.bg} mb-3`}>
                    <stat.icon size={28} className={stat.color}/>
                  </div>
                  <h3 className={`fw-bold ${stat.color}`}>{stat.number}</h3>
                  <p className="text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="update-icon d-flex align-items-center justify-content-center bg-warning text-white rounded shadow-custom border-dark">
              <TrendingUp size={20}/>
            </div>
            <h3 className="h4 fw-bold mb-0">Recent Updates</h3>
          </div>
          <div className="row g-4">
            {updates.map((update) => (
              <div key={update.id} className="col-md-6">
                <div className="card p-3 border-dark rounded shadow-custom hover-shadow">
                  <div className="d-flex gap-3">
                    <div className={`icon-update d-flex align-items-center justify-content-center ${update.color} text-white rounded border-dark`}>
                      {update.type === 'placement' && <Award size={20}/>}
                      {update.type === 'news' && <BookOpen size={20}/>}
                      {update.type === 'event' && <Users size={20}/>}
                    </div>
                    <div>
                      <h5 className="fw-bold">{update.title}</h5>
                      <p className="text-muted">{update.description}</p>
                      <div className="d-flex align-items-center gap-1 text-secondary small">
                        <Clock size={14}/> {update.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="h4 fw-bold mb-2">Explore Resources</h3>
          <p className="text-muted mb-4">Everything you need to ace your placement interviews</p>

          <div className="row g-4">
            {[
              { icon: BookOpen, title: 'Company Questions', desc: 'Access interview questions from 500+ companies.', button: 'Explore Questions', btnClass: 'btn-primary', iconBg: 'bg-primary' },
              { icon: Code, title: 'Winning Projects', desc: 'Browse community-submitted projects that helped students land their dream jobs.', button: 'Browse Projects', btnClass: 'btn-purple', iconBg: 'bg-purple' },
              { icon: Users, title: 'Mock Interviews', desc: 'Practice with realistic mock interviews and get instant feedback.', button: 'Start Practice', btnClass: 'btn-success', iconBg: 'bg-success' },
            ].map((feature, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card p-4 border-dark rounded shadow-custom hover-shadow">
                  <div className={`icon-wrapper mb-3 ${feature.iconBg} text-white`}>
                    <feature.icon size={28}/>
                  </div>
                  <h5 className="fw-bold">{feature.title}</h5>
                  <p className="text-muted">{feature.desc}</p>
                  <button className={`btn ${feature.btnClass} w-100 mt-3`}>
                    {feature.button} <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-white border-top border-dark text-center">
        <div className="container">
          <p className="text-muted mb-0">&copy; 2025 Placement Prep Portal. Empowering students to achieve their career goals.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
