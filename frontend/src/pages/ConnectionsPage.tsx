import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import type { Connection, Person } from '../types';
import './ConnectionsPage.css';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [connectionsData, peopleData] = await Promise.all([
        peopleApi.getConnections(),
        peopleApi.getAll(),
      ]);
      setConnections(connectionsData);
      setPeople(peopleData);
      setError(null);
    } catch {
      setError('Failed to load connections. Make sure the backend is running.');
      // Use mock data for demo
      setPeople([
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', role: 'Senior Developer', connectionIds: [2, 3, 5] },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Engineering', role: 'Tech Lead', connectionIds: [1, 3, 4] },
        { id: 3, name: 'Carol Williams', email: 'carol@example.com', department: 'Product', role: 'Product Manager', connectionIds: [1, 2, 4, 6] },
        { id: 4, name: 'David Brown', email: 'david@example.com', department: 'Design', role: 'UX Designer', connectionIds: [2, 3, 5] },
        { id: 5, name: 'Eva Martinez', email: 'eva@example.com', department: 'Marketing', role: 'Marketing Lead', connectionIds: [1, 4, 6] },
        { id: 6, name: 'Frank Chen', email: 'frank@example.com', department: 'Sales', role: 'Sales Director', connectionIds: [3, 5] },
      ]);
      setConnections([
        { id: 1, sourcePersonId: 1, targetPersonId: 2, relationType: 'Colleague', description: 'Work on same team' },
        { id: 2, sourcePersonId: 1, targetPersonId: 3, relationType: 'Project', description: 'Collaborate on Project X' },
        { id: 3, sourcePersonId: 1, targetPersonId: 5, relationType: 'Cross-functional', description: 'Marketing liaison' },
        { id: 4, sourcePersonId: 2, targetPersonId: 3, relationType: 'Stakeholder', description: 'Product review meetings' },
        { id: 5, sourcePersonId: 2, targetPersonId: 4, relationType: 'Project', description: 'Design collaboration' },
        { id: 6, sourcePersonId: 3, targetPersonId: 4, relationType: 'Project', description: 'UX/Product alignment' },
        { id: 7, sourcePersonId: 3, targetPersonId: 6, relationType: 'Business', description: 'Sales enablement' },
        { id: 8, sourcePersonId: 4, targetPersonId: 5, relationType: 'Cross-functional', description: 'Marketing materials design' },
        { id: 9, sourcePersonId: 5, targetPersonId: 6, relationType: 'Partner', description: 'Marketing-Sales pipeline' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPersonName = (id: number) => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  const getRelationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Colleague: '#667eea',
      Project: '#48bb78',
      'Cross-functional': '#ed8936',
      Stakeholder: '#9f7aea',
      Business: '#f56565',
      Partner: '#4fd1c5',
    };
    return colors[type] || '#718096';
  };

  const relationTypes = ['all', ...new Set(connections.map(c => c.relationType))];
  const filteredConnections = selectedType === 'all' 
    ? connections 
    : connections.filter(c => c.relationType === selectedType);

  return (
    <div className="connections-page">
      <header className="page-header">
        <h1>🔗 Connections Map</h1>
        <p>Visualize relationships and connections between team members</p>
      </header>

      {error && (
        <div className="alert alert-warning">
          ⚠️ {error}
        </div>
      )}

      <div className="filter-bar">
        <label>Filter by Type:</label>
        <div className="filter-buttons">
          {relationTypes.map((type) => (
            <button
              key={type}
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
              style={selectedType === type && type !== 'all' ? { background: getRelationTypeColor(type) } : {}}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading connections...</span>
        </div>
      ) : (
        <div className="connections-content">
          <section className="connections-grid-section">
            <h2>Connection Matrix ({filteredConnections.length} connections)</h2>
            <div className="connections-list">
              {filteredConnections.map((connection) => (
                <div key={connection.id} className="connection-card">
                  <div className="connection-header">
                    <span 
                      className="relation-badge" 
                      style={{ background: getRelationTypeColor(connection.relationType) }}
                    >
                      {connection.relationType}
                    </span>
                  </div>
                  <div className="connection-body">
                    <div className="connection-people">
                      <span className="person-name">{getPersonName(connection.sourcePersonId)}</span>
                      <span className="connection-arrow">↔</span>
                      <span className="person-name">{getPersonName(connection.targetPersonId)}</span>
                    </div>
                    <p className="connection-description">{connection.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="connection-stats">
            <h2>Connection Statistics</h2>
            <div className="stats-cards">
              <div className="stat-card">
                <span className="stat-icon">🔗</span>
                <span className="stat-value">{connections.length}</span>
                <span className="stat-label">Total Connections</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{people.length}</span>
                <span className="stat-label">Team Members</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <span className="stat-value">{(connections.length / people.length).toFixed(1)}</span>
                <span className="stat-label">Avg. Connections</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏷️</span>
                <span className="stat-value">{new Set(connections.map(c => c.relationType)).size}</span>
                <span className="stat-label">Relation Types</span>
              </div>
            </div>
          </section>

          <section className="relation-types-breakdown">
            <h2>Connections by Type</h2>
            <div className="type-bars">
              {[...new Set(connections.map(c => c.relationType))].map((type) => {
                const count = connections.filter(c => c.relationType === type).length;
                const percentage = (count / connections.length) * 100;
                return (
                  <div key={type} className="type-bar-item">
                    <div className="type-bar-label">
                      <span>{type}</span>
                      <span>{count}</span>
                    </div>
                    <div className="type-bar-bg">
                      <div 
                        className="type-bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          background: getRelationTypeColor(type)
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
