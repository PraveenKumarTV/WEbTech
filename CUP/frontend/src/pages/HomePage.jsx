import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, BookOpen, Code, Users, Award, Clock } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const [updates] = useState([
    {
      id: 1,
      title: 'Google Off-Campus Drive 2025',
      description: 'Applications open for Software Engineering roles. Last date: Nov 15',
      date: '2 hours ago',
      type: 'placement'
    },
    {
      id: 2,
      title: 'Microsoft Hiring for SDE-1',
      description: 'Campus recruitment drive scheduled for December 2025',
      date: '5 hours ago',
      type: 'placement'
    },
    {
      id: 3,
      title: 'New Mock Interview Series Added',
      description: 'Practice with real interview questions from FAANG companies',
      date: '1 day ago',
      type: 'news'
    },
    {
      id: 4,
      title: 'Hackathon Winners Announced',
      description: 'Check out the winning projects from our recent hackathon',
      date: '2 days ago',
      type: 'event'
    }
  ]);

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here (e.g. clearing auth tokens)
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-container">
          <div className="header-brand animate-fade-in">
            
            <h1 className="logo-text">Placement Prep Portal</h1>
          </div>
          
            
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <h2 className="hero-heading animate-slide-up">
            <span className="gradient-text">Master Your Placement Journey</span>
          </h2>
          <p className="hero-subheading animate-slide-up-delay">
            Your comprehensive platform for campus placements with curated resources,
            real interview questions, and winning project ideas from top companies.
          </p>
          <div className="stat-card-group animate-fade-in-delay">
            <div className="stat-card" role="region" aria-label="Companies statistic">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-card" role="region" aria-label="Questions statistic">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-card" role="region" aria-label="Success rate statistic">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="update-section">
        <div className="container">
          <h3 className="section-heading">
            <TrendingUp size={32} className="heading-icon" />
            Recent Updates
          </h3>
          <div className="updates-grid">
            {updates.map((update, index) => (
              <div
                key={update.id}
                className="update-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                role="article"
                aria-label={`Update: ${update.title}`}
              >
                <div className="update-content">
                  <div className={`update-icon ${update.type}`}>
                    {update.type === 'placement' && <Award size={20} />}
                    {update.type === 'news' && <BookOpen size={20} />}
                    {update.type === 'event' && <Users size={20} />}
                  </div>
                  <div className="update-text">
                    <h4>{update.title}</h4>
                    <p>{update.description}</p>
                    <div className="update-time">
                      <Clock size={14} className="mr-1" />
                      {update.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h3 className="section-heading">Explore Resources</h3>
          <div className="features-grid">
            <div className="feature-card card-1">
              <div className="feature-icon blue" aria-hidden="true">
                <BookOpen size={32} />
              </div>
              <h4>Company Questions</h4>
              <p>Access interview questions from 500+ companies including Google, Microsoft, Amazon, and more.</p>
              <button
                className="feature-btn"
                onClick={() => navigate('/company-questions')}
                aria-label="Explore Company Questions"
              >
                Explore Questions
              </button>
            </div>

            <div className="feature-card card-2">
              <div className="feature-icon cyan" aria-hidden="true">
                <Code size={32} />
              </div>
              <h4>Winning Projects</h4>
              <p>Browse community-submitted projects that helped students land their dream jobs.</p>
              <button
                className="feature-btn"
                onClick={() => navigate('/winning-projects')}
                aria-label="Browse Winning Projects"
              >
                Browse Projects
              </button>
            </div>

            <div className="feature-card card-3">
              <div className="feature-icon purple" aria-hidden="true">
                <Users size={32} />
              </div>
              <h4>Mock Interviews</h4>
              <p>Practice with realistic mock interviews and get instant feedback on your performance.</p>
              <button
                className="feature-btn"
                onClick={() => navigate('/mock-interview')}
                aria-label="Start Mock Interviews"
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container text-center">
          <p>&copy; 2025 Placement Prep Portal. Empowering students to achieve their career goals.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
