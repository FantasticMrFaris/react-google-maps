import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SportsVenuesPage } from './pages/SportsVenuesPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <div className="nav-brand">
            <Link to="/">🏟️ SportsApp</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/venues" className="nav-link">Venues</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/teams" className="nav-link">Teams</Link>
          </div>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/venues" element={<SportsVenuesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const HomePage: React.FC = () => (
  <div className="page-container">
    <div className="hero-section">
      <h1>Welcome to SportsApp</h1>
      <p>Discover sports venues, events, and teams near you</p>
      <Link to="/venues" className="cta-button">
        Explore Venues
      </Link>
    </div>
  </div>
);

const EventsPage: React.FC = () => (
  <div className="page-container">
    <h1>Sports Events</h1>
    <p>Events page coming soon...</p>
  </div>
);

const TeamsPage: React.FC = () => (
  <div className="page-container">
    <h1>Sports Teams</h1>
    <p>Teams page coming soon...</p>
  </div>
);

export default App;