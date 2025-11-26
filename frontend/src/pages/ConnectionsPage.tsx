import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import type { Connection, Person, Signals } from '../types';
import './ConnectionsPage.css';

// Default signals (all false)
const defaultSignals: Signals = {
  previousHomelessness: false,
  temporaryAccommodation: false,
  careStatus: false,
  parentalSubstanceAbuse: false,
  parentalCrimes: false,
  youthJustice: false,
  educationStatus: false,
};

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
      setError('Failed to load relationships. Make sure the backend is running.');
      // Use mock data for demo - homelessness prevention context
      setPeople([
        { id: 1, name: 'Tyler Wilson', email: 'tyler.w@email.com', department: 'Youth Housing', role: 'At-Risk Youth', connectionIds: [2, 3, 5], riskScore: 'red', signals: { ...defaultSignals, previousHomelessness: true, temporaryAccommodation: true, parentalSubstanceAbuse: true } },
        { id: 2, name: 'Maria Wilson', email: 'maria.w@email.com', department: 'Family Network', role: 'Parent', connectionIds: [1, 3], riskScore: 'green', signals: defaultSignals },
        { id: 3, name: 'Emma Davis', email: 'emma.d@council.gov.uk', department: 'Child Protection', role: 'Social Worker', connectionIds: [1, 2, 4], riskScore: 'green', signals: defaultSignals },
        { id: 4, name: 'Jack Roberts', email: 'jack.r@council.gov.uk', department: 'Youth Services', role: 'Youth Worker', connectionIds: [3, 5, 6], riskScore: 'green', signals: defaultSignals },
        { id: 5, name: 'Sarah Mitchell', email: 'sarah.m@council.gov.uk', department: 'Youth Housing', role: 'Housing Officer', connectionIds: [1, 4, 6], riskScore: 'green', signals: defaultSignals },
        { id: 6, name: 'Noah Anderson', email: 'noah.a@email.com', department: 'Care Leavers', role: 'Care Leaver', connectionIds: [4, 5], riskScore: 'amber', signals: { ...defaultSignals, careStatus: true, previousHomelessness: true } },
      ]);
      setConnections([
        { id: 1, sourcePersonId: 1, targetPersonId: 2, relationType: 'Family', description: 'Parent-child relationship' },
        { id: 2, sourcePersonId: 1, targetPersonId: 3, relationType: 'Case Worker', description: 'Assigned social worker' },
        { id: 3, sourcePersonId: 1, targetPersonId: 5, relationType: 'Housing Support', description: 'Housing case management' },
        { id: 4, sourcePersonId: 2, targetPersonId: 3, relationType: 'Family Support', description: 'Family intervention support' },
        { id: 5, sourcePersonId: 3, targetPersonId: 4, relationType: 'Referral', description: 'Cross-agency referral' },
        { id: 6, sourcePersonId: 4, targetPersonId: 5, relationType: 'Collaboration', description: 'Joint case management' },
        { id: 7, sourcePersonId: 4, targetPersonId: 6, relationType: 'Youth Support', description: 'Ongoing youth engagement' },
        { id: 8, sourcePersonId: 5, targetPersonId: 6, relationType: 'Housing Support', description: 'Housing placement support' },
        { id: 9, sourcePersonId: 3, targetPersonId: 6, relationType: 'Case Worker', description: 'Care leaver support' },
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
      Family: '#e53e3e',
      'Case Worker': '#667eea',
      'Housing Support': '#48bb78',
      'Family Support': '#9f7aea',
      Referral: '#ed8936',
      Collaboration: '#4fd1c5',
      'Youth Support': '#f687b3',
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
        <h1>🔗 Relationships Map</h1>
        <p>Visualize relationships between individuals, families, and support workers</p>
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
          <span>Loading relationships...</span>
        </div>
      ) : (
        <div className="connections-content">
          <section className="connections-grid-section">
            <h2>Relationship Matrix ({filteredConnections.length} relationships)</h2>
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
            <h2>Relationship Statistics</h2>
            <div className="stats-cards">
              <div className="stat-card">
                <span className="stat-icon">🔗</span>
                <span className="stat-value">{connections.length}</span>
                <span className="stat-label">Total Relationships</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{people.length}</span>
                <span className="stat-label">Individuals</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <span className="stat-value">{(connections.length / people.length).toFixed(1)}</span>
                <span className="stat-label">Avg. Relationships</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏷️</span>
                <span className="stat-value">{new Set(connections.map(c => c.relationType)).size}</span>
                <span className="stat-label">Relationship Types</span>
              </div>
            </div>
          </section>

          <section className="relation-types-breakdown">
            <h2>Relationships by Type</h2>
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
