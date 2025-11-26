import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { mockPeople } from '../data/mockData';
import ConnectionModal from '../components/ConnectionModal';
import type { Person, UserRole } from '../types';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, getConnectionsForUser } = useAuth();
  const [selectedConnection, setSelectedConnection] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connections = getConnectionsForUser();

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      teacher: '👩‍🏫',
      doctor: '👨‍⚕️',
      parent: '👪',
      admin: '🔐',
    };
    return icons[role];
  };

  const getConnectionLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      teacher: 'Students',
      doctor: 'Patients',
      parent: 'Children',
      admin: 'All People',
    };
    return labels[role];
  };

  const getConnectionIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      teacher: '🎓',
      doctor: '🏥',
      parent: '👶',
      admin: '👥',
    };
    return icons[role];
  };

  const getDepartmentColor = (department: string): string => {
    const colors: Record<string, string> = {
      'Class 5A': '#667eea',
      'Class 3B': '#48bb78',
      'Primary Care': '#ed8936',
      'Emergency': '#e53e3e',
    };
    return colors[department] || '#9f7aea';
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
            <p>No connections found for your account.</p>
          </div>
        ) : (
          <div className="connections-grid">
            {connections.map((person) => (
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
                <div className="connection-action">
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
            <span className="stat-icon">🔗</span>
            <span className="stat-number">
              {new Set(connections.map(c => c.department)).size}
            </span>
            <span className="stat-description">Departments</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-number">Active</span>
            <span className="stat-description">Account Status</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🛡️</span>
            <span className="stat-number">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
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
