import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import NetworkGraph from '../components/NetworkGraph';
import { mockPeople, mockUsers } from '../data/mockData';
import type { NetworkData, Person } from '../types';
import './PeoplePage.css';

const PeoplePage = () => {
  const [networkData, setNetworkData] = useState<NetworkData>({ nodes: [], links: [] });
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [network, peopleData] = await Promise.all([
        peopleApi.getNetworkData(),
        peopleApi.getAll(),
      ]);
      setNetworkData(network);
      setPeople(peopleData);
      setError(null);
    } catch {
      setError('Failed to load network data. Using local dataset.');
      // Use data from homelessness dataset for demo
      setPeople(mockPeople);
      
      // Create nodes for both people and workers (users)
      const peopleNodes = mockPeople.map(p => ({ 
        id: p.id, 
        label: p.name, 
        group: p.department 
      }));
      const workerNodes = mockUsers
        .filter(u => u.id !== 4) // Exclude admin
        .map(u => ({
          id: u.id,
          label: u.name,
          group: u.role === 'housing_officer' ? 'Housing Officers' :
                 u.role === 'social_worker' ? 'Social Workers' :
                 u.role === 'youth_worker' ? 'Youth Workers' : 'Staff'
        }));
      
      // Generate network links based on connectionIds
      const links = mockPeople.flatMap(p => 
        p.connectionIds.map(targetId => ({
          source: p.id,
          target: targetId,
          label: p.department === 'Youth Housing' ? 'Housing Support' : 
                 p.department === 'Child Protection' ? 'Case Worker' :
                 p.department === 'Care Leavers' ? 'Care Support' : 'Support'
        }))
      );
      
      setNetworkData({
        nodes: [...peopleNodes, ...workerNodes],
        links: links,
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'Youth Housing': '#667eea',
      'Family Network': '#48bb78',
      'Child Protection': '#e53e3e',
      'Youth Services': '#9f7aea',
      'Care Leavers': '#ed8936',
      'Family Support': '#4fd1c5',
      'Housing Officers': '#3182ce',
      'Social Workers': '#d53f8c',
      'Youth Workers': '#38a169',
      'Staff': '#718096',
    };
    return colors[department] || '#718096';
  };

  return (
    <div className="people-page">
      <header className="page-header">
        <h1>👥 Individuals Network</h1>
        <p>Interactive visualization of individuals and their support relationships</p>
      </header>

      {error && (
        <div className="alert alert-warning">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading network data...</span>
        </div>
      ) : (
        <div className="people-content">
          <section className="network-section">
            <h2>Network Visualization</h2>
            <p className="section-subtitle">
              Drag nodes to reposition. Scroll to zoom. Click and drag the background to pan.
            </p>
            <NetworkGraph data={networkData} width={850} height={500} />
          </section>

          <div className="people-sidebar">
            <section className="people-list-section">
              <h2>Individuals ({people.length})</h2>
              <div className="people-list">
                {people.map((person) => (
                  <div
                    key={person.id}
                    className={`person-card ${selectedPerson?.id === person.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <div 
                      className="person-avatar"
                      style={{ background: getDepartmentColor(person.department) }}
                    >
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="person-info">
                      <h4>{person.name}</h4>
                      <span className="person-role">{person.role}{person.age ? ` • ${person.age} yrs` : ''}</span>
                      <span className="person-dept">{person.department}</span>
                    </div>
                    <span className="connection-count">
                      {person.connectionIds.length} relationships
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {selectedPerson && (
              <section className="person-details">
                <h2>Profile Details</h2>
                <div className="details-card">
                  <div className="details-header">
                    <div 
                      className="large-avatar"
                      style={{ background: getDepartmentColor(selectedPerson.department) }}
                    >
                      {selectedPerson.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3>{selectedPerson.name}</h3>
                      <span className="role-badge">{selectedPerson.role}</span>
                    </div>
                  </div>
                  <div className="details-body">
                    <div className="detail-item">
                      <label>📧 Email</label>
                      <span>{selectedPerson.email}</span>
                    </div>
                    {selectedPerson.age && (
                      <div className="detail-item">
                        <label>🎂 Age</label>
                        <span>{selectedPerson.age} years ({selectedPerson.ageGroup})</span>
                      </div>
                    )}
                    {selectedPerson.gender && (
                      <div className="detail-item">
                        <label>👤 Gender</label>
                        <span>{selectedPerson.gender}</span>
                      </div>
                    )}
                    {selectedPerson.housingTenure && (
                      <div className="detail-item">
                        <label>🏠 Housing</label>
                        <span>{selectedPerson.housingTenure}</span>
                      </div>
                    )}
                    {selectedPerson.employmentStatus && (
                      <div className="detail-item">
                        <label>💼 Employment</label>
                        <span>{selectedPerson.employmentStatus}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>🏷️ Category</label>
                      <span>{selectedPerson.department}</span>
                    </div>
                    <div className="detail-item">
                      <label>🔗 Relationships</label>
                      <span>{selectedPerson.connectionIds.length} individuals</span>
                    </div>
                    <div className="connected-to">
                      <label>Connected To</label>
                      <div className="connected-list">
                        {selectedPerson.connectionIds.map((id) => {
                          const connectedPerson = people.find(p => p.id === id);
                          return connectedPerson ? (
                            <span key={id} className="connected-badge">
                              {connectedPerson.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      <section className="team-stats">
        <h2>Category Overview</h2>
        <div className="stats-row">
          {Object.entries(
            people.reduce((acc, p) => {
              acc[p.department] = (acc[p.department] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([dept, count]) => (
            <div key={dept} className="dept-stat">
              <div 
                className="dept-color"
                style={{ background: getDepartmentColor(dept) }}
              ></div>
              <span className="dept-name">{dept}</span>
              <span className="dept-count">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PeoplePage;
