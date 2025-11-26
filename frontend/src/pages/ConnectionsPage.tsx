import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import { mockPeople } from '../data/mockData';
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
      setError('Failed to load relationships. Using local dataset.');
      // Use data from homelessness dataset for demo
      setPeople(mockPeople);
      // Generate connections based on the mockPeople connectionIds
      const generatedConnections: Connection[] = [];
      let connectionId = 1;
      mockPeople.forEach(person => {
        person.connectionIds.forEach(targetId => {
          const targetPerson = mockPeople.find(p => p.id === targetId);
          if (targetPerson && !generatedConnections.some(c => 
            (c.sourcePersonId === person.id && c.targetPersonId === targetId) ||
            (c.sourcePersonId === targetId && c.targetPersonId === person.id)
          )) {
            const relationType = person.department === 'Youth Housing' ? 'Housing Support' :
                                  person.department === 'Child Protection' ? 'Case Worker' :
                                  person.department === 'Care Leavers' ? 'Care Support' :
                                  person.department === 'Family Support' ? 'Family Support' : 'Support';
            generatedConnections.push({
              id: connectionId++,
              sourcePersonId: person.id,
              targetPersonId: targetId,
              relationType,
              description: `${relationType} relationship`,
            });
          }
        });
      });
      setConnections(generatedConnections);
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
      'Care Support': '#ed8936',
      Referral: '#38b2ac',
      Collaboration: '#4fd1c5',
      'Youth Support': '#f687b3',
      Support: '#718096',
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
