import { useState, useEffect } from 'react';
import { peopleApi } from '../services/api';
import NetworkGraph from '../components/NetworkGraph';
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
      setError('Failed to load network data. Make sure the backend is running.');
      // Use mock data for demo
      const mockPeople: Person[] = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', role: 'Senior Developer', connectionIds: [2, 3, 5] },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Engineering', role: 'Tech Lead', connectionIds: [1, 3, 4] },
        { id: 3, name: 'Carol Williams', email: 'carol@example.com', department: 'Product', role: 'Product Manager', connectionIds: [1, 2, 4, 6] },
        { id: 4, name: 'David Brown', email: 'david@example.com', department: 'Design', role: 'UX Designer', connectionIds: [2, 3, 5] },
        { id: 5, name: 'Eva Martinez', email: 'eva@example.com', department: 'Marketing', role: 'Marketing Lead', connectionIds: [1, 4, 6] },
        { id: 6, name: 'Frank Chen', email: 'frank@example.com', department: 'Sales', role: 'Sales Director', connectionIds: [3, 5] },
      ];
      setPeople(mockPeople);
      setNetworkData({
        nodes: mockPeople.map(p => ({ id: p.id, label: p.name, group: p.department })),
        links: [
          { source: 1, target: 2, label: 'Colleague' },
          { source: 1, target: 3, label: 'Project' },
          { source: 1, target: 5, label: 'Cross-functional' },
          { source: 2, target: 3, label: 'Stakeholder' },
          { source: 2, target: 4, label: 'Project' },
          { source: 3, target: 4, label: 'Project' },
          { source: 3, target: 6, label: 'Business' },
          { source: 4, target: 5, label: 'Cross-functional' },
          { source: 5, target: 6, label: 'Partner' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering: '#667eea',
      Product: '#764ba2',
      Design: '#f093fb',
      Marketing: '#f5576c',
      Sales: '#4facfe',
    };
    return colors[department] || '#718096';
  };

  return (
    <div className="people-page">
      <header className="page-header">
        <h1>👥 People Network</h1>
        <p>Interactive visualization of team connections and relationships</p>
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
              <h2>Team Members ({people.length})</h2>
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
                      {person.connectionIds.length} connections
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
                      <label>🏢 Department</label>
                      <span>{selectedPerson.department}</span>
                    </div>
                    <div className="detail-item">
                      <label>🔗 Connections</label>
                      <span>{selectedPerson.connectionIds.length} team members</span>
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
        <h2>Team Overview</h2>
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
