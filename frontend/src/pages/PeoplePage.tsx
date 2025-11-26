import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import NetworkGraph from '../components/NetworkGraph';
import type { NetworkData, Person } from '../types';
import { defaultSignals } from '../utils/riskUtils';
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
      setError('Failed to load network data. Make sure the backend is running.');
      // Use mock data for demo - homelessness prevention context
      const mockPeople: Person[] = [
        { id: 1, name: 'Tyler Wilson', email: 'tyler.w@email.com', department: 'Youth Housing', role: 'At-Risk Youth', connectionIds: [2, 3, 5], riskScore: 'red', signals: { ...defaultSignals, previousHomelessness: true, temporaryAccommodation: true, parentalSubstanceAbuse: true } },
        { id: 2, name: 'Maria Wilson', email: 'maria.w@email.com', department: 'Family Network', role: 'Parent', connectionIds: [1, 3], riskScore: 'green', signals: defaultSignals },
        { id: 3, name: 'Emma Davis', email: 'emma.d@council.gov.uk', department: 'Child Protection', role: 'Social Worker', connectionIds: [1, 2, 4, 6], riskScore: 'green', signals: defaultSignals },
        { id: 4, name: 'Jack Roberts', email: 'jack.r@council.gov.uk', department: 'Youth Services', role: 'Youth Worker', connectionIds: [3, 5, 6], riskScore: 'green', signals: defaultSignals },
        { id: 5, name: 'Sarah Mitchell', email: 'sarah.m@council.gov.uk', department: 'Youth Housing', role: 'Housing Officer', connectionIds: [1, 4, 6], riskScore: 'green', signals: defaultSignals },
        { id: 6, name: 'Noah Anderson', email: 'noah.a@email.com', department: 'Care Leavers', role: 'Care Leaver', connectionIds: [3, 4, 5], riskScore: 'amber', signals: { ...defaultSignals, careStatus: true, previousHomelessness: true } },
      ];
      setPeople(mockPeople);
      setNetworkData({
        nodes: mockPeople.map(p => ({ id: p.id, label: p.name, group: p.department })),
        links: [
          { source: 1, target: 2, label: 'Family' },
          { source: 1, target: 3, label: 'Case Worker' },
          { source: 1, target: 5, label: 'Housing Support' },
          { source: 2, target: 3, label: 'Family Support' },
          { source: 3, target: 4, label: 'Referral' },
          { source: 3, target: 6, label: 'Case Worker' },
          { source: 4, target: 5, label: 'Collaboration' },
          { source: 4, target: 6, label: 'Youth Support' },
          { source: 5, target: 6, label: 'Housing Support' },
        ],
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
                      <span className="person-role">{person.role}</span>
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
