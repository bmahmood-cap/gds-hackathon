import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { mockPeople } from '../data/mockData';
import ConnectionModal from '../components/ConnectionModal';
import type { Person, UserRole, RiskScore } from '../types';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, getConnectionsForUser } = useAuth();
  const [selectedConnection, setSelectedConnection] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connections = getConnectionsForUser();

  // Sort connections by risk score: Red > Amber > Green
  const riskOrder: Record<RiskScore, number> = { red: 0, amber: 1, green: 2 };
  const sortedConnections = [...connections].sort((a, b) => 
    riskOrder[a.riskScore] - riskOrder[b.riskScore]
  );

  const getRiskScoreColor = (riskScore: RiskScore): string => {
    const colors: Record<RiskScore, string> = {
      red: '#e53e3e',
      amber: '#ed8936',
      green: '#48bb78',
    };
    return colors[riskScore];
  };

  const getRiskScoreLabel = (riskScore: RiskScore): string => {
    const labels: Record<RiskScore, string> = {
      red: 'High Risk',
      amber: 'Medium Risk',
      green: 'Low Risk',
    };
    return labels[riskScore];
  };

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      housing_officer: '🏠',
      social_worker: '👩‍⚕️',
      youth_worker: '🤝',
      admin: '🔐',
    };
    return icons[role];
  };

  const getConnectionLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      housing_officer: 'Cases',
      social_worker: 'Individuals',
      youth_worker: 'Young People',
      admin: 'All Records',
    };
    return labels[role];
  };

  const getConnectionIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      housing_officer: '🏡',
      social_worker: '👶',
      youth_worker: '🎯',
      admin: '👥',
    };
    return icons[role];
  };

  const getDepartmentColor = (department: string): string => {
    const colors: Record<string, string> = {
      'Youth Housing': '#667eea',
      'Family Support': '#48bb78',
      'Care Leavers': '#ed8936',
      'Child Protection': '#e53e3e',
      'Youth Services': '#9f7aea',
      'Family Network': '#4fd1c5',
    };
    return colors[department] || '#718096';
  };

  const handleConnectionClick = (person: Person) => {
    setSelectedConnection(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConnection(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="header-content">
          <div className="user-welcome">
            <span className="welcome-icon">{getRoleIcon(user.role)}</span>
            <div>
              <h1>Welcome, {user.name.split(' ')[0]}</h1>
              <p>View and manage your {getConnectionLabel(user.role).toLowerCase()}</p>
            </div>
          </div>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{connections.length}</span>
              <span className="stat-label">{getConnectionLabel(user.role)}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="connections-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">{getConnectionIcon(user.role)}</span>
            Your {getConnectionLabel(user.role)}
          </h2>
          <span className="connection-count-badge">{connections.length}</span>
        </div>

        {connections.length === 0 ? (
          <div className="no-connections">
            <span className="no-connections-icon">📋</span>
            <p>No cases assigned to your account.</p>
          </div>
        ) : (
          <div className="connections-grid">
            {sortedConnections.map((person) => (
              <div
                key={person.id}
                className="connection-card"
                onClick={() => handleConnectionClick(person)}
              >
                <div 
                  className="connection-avatar"
                  style={{ background: getDepartmentColor(person.department) }}
                >
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="connection-info">
                  <h3>{person.name}</h3>
                  <span className="connection-role">{person.role}</span>
                  <span className="connection-department">{person.department}</span>
                </div>
                <div className="connection-right">
                  <div 
                    className="risk-score-badge"
                    style={{ 
                      background: getRiskScoreColor(person.riskScore),
                      boxShadow: `0 0 8px ${getRiskScoreColor(person.riskScore)}40`
                    }}
                  >
                    {getRiskScoreLabel(person.riskScore)}
                  </div>
                  <span className="view-details">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="quick-stats">
        <h2>Quick Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-number">{connections.length}</span>
            <span className="stat-description">Total {getConnectionLabel(user.role)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏷️</span>
            <span className="stat-number">
              {new Set(connections.map(c => c.department)).size}
            </span>
            <span className="stat-description">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-number">Active</span>
            <span className="stat-description">Account Status</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🛡️</span>
            <span className="stat-number">{user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
            <span className="stat-description">Role</span>
          </div>
        </div>
      </section>

      {isModalOpen && selectedConnection && (
        <ConnectionModal
          person={selectedConnection}
          allPeople={mockPeople}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DashboardPage;
