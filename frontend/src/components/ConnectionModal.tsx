import { useState } from 'react';
import NetworkGraph from './NetworkGraph';
import type { Person, NetworkData, Connection, Signals } from '../types';
import { signalLabels, getRiskScoreColor, getRiskScoreLabel } from '../utils/riskUtils';
import './ConnectionModal.css';

interface ConnectionModalProps {
  person: Person;
  allPeople: Person[];
  onClose: () => void;
}

type TabType = 'connections' | 'network' | 'signals';

function getRelationType(role: string): string {
  const types: Record<string, string> = {
    Student: 'Student',
    Patient: 'Patient',
    Child: 'Child',
    default: 'Connection',
  };
  return types[role] || types.default;
}

function generateConnections(person: Person): Connection[] {
  return person.connectionIds.map((targetId, index) => ({
    id: index + 1,
    sourcePersonId: person.id,
    targetPersonId: targetId,
    relationType: getRelationType(person.role),
    description: `${person.role} relationship`,
  }));
}

function generateNetworkData(person: Person, allPeople: Person[]): NetworkData {
  const connectedPeople = allPeople.filter(p => 
    person.connectionIds.includes(p.id) || p.id === person.id
  );
  
  const nodes = [
    { id: person.id, label: person.name, group: person.department },
    ...connectedPeople
      .filter(p => p.id !== person.id)
      .map(p => ({ id: p.id, label: p.name, group: p.department }))
  ];

  const links = person.connectionIds
    .filter(id => allPeople.some(p => p.id === id))
    .map(targetId => ({
      source: person.id,
      target: targetId,
      label: getRelationType(person.role),
    }));

  return { nodes, links };
}

const ConnectionModal = ({ person, allPeople, onClose }: ConnectionModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('connections');

  const connections = generateConnections(person);
  const networkData = generateNetworkData(person, allPeople);

  const getPersonById = (id: number): Person | undefined => {
    return allPeople.find(p => p.id === id);
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <div 
              className="modal-avatar"
              style={{ background: getDepartmentColor(person.department) }}
            >
              {person.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2>{person.name}</h2>
              <span className="modal-role">{person.role} • {person.department}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            <span className="tab-icon">🔗</span>
            Connections Map
          </button>
          <button
            className={`modal-tab ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <span className="tab-icon">👥</span>
            People Map
          </button>
          <button
            className={`modal-tab ${activeTab === 'signals' ? 'active' : ''}`}
            onClick={() => setActiveTab('signals')}
          >
            <span className="tab-icon">🚩</span>
            Signals
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'connections' && (
            <div className="connections-tab">
              <div className="connections-info">
                <h3>Relationship Overview</h3>
                <p>{person.name} has {connections.length} connection(s) in the system.</p>
              </div>
              
              <div className="connections-list-modal">
                {connections.length === 0 ? (
                  <div className="no-data">
                    <span>📭</span>
                    <p>No connections found</p>
                  </div>
                ) : (
                  connections.map((connection) => {
                    const targetPerson = getPersonById(connection.targetPersonId);
                    return (
                      <div key={connection.id} className="connection-item">
                        <div className="connection-line">
                          <div 
                            className="connection-node"
                            style={{ background: getDepartmentColor(person.department) }}
                          >
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="connection-link">
                            <span className="link-label">{connection.relationType}</span>
                            <div className="link-line"></div>
                          </div>
                          <div 
                            className="connection-node"
                            style={{ background: targetPerson ? getDepartmentColor(targetPerson.department) : '#718096' }}
                          >
                            {targetPerson?.name.split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                        </div>
                        <div className="connection-details">
                          <span className="detail-names">
                            {person.name} → {targetPerson?.name || 'Unknown'}
                          </span>
                          <span className="detail-desc">{connection.description}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="network-tab">
              <div className="network-info">
                <h3>Network Visualization</h3>
                <p>Interactive graph showing {person.name}'s connections and relationships.</p>
              </div>
              
              {networkData.nodes.length > 0 ? (
                <div className="network-container">
                  <NetworkGraph data={networkData} width={600} height={400} />
                </div>
              ) : (
                <div className="no-data">
                  <span>📊</span>
                  <p>No network data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="signals-tab">
              <div className="signals-header">
                <div className="risk-score-display">
                  <h3>Risk Assessment</h3>
                  <div 
                    className="risk-score-badge-large"
                    style={{ 
                      background: getRiskScoreColor(person.riskScore),
                      boxShadow: `0 0 12px ${getRiskScoreColor(person.riskScore)}40`
                    }}
                  >
                    {getRiskScoreLabel(person.riskScore)}
                  </div>
                </div>
                <p>The following signals contribute to {person.name}'s risk score.</p>
              </div>
              
              <div className="signals-list">
                {(Object.keys(signalLabels) as Array<keyof Signals>).map((key) => {
                  const isActive = person.signals[key];
                  return (
                    <div 
                      key={key} 
                      className={`signal-item ${isActive ? 'active' : 'inactive'}`}
                    >
                      <span className="signal-icon">{signalLabels[key].icon}</span>
                      <span className="signal-label">{signalLabels[key].label}</span>
                      <span className={`signal-status ${isActive ? 'flagged' : 'clear'}`}>
                        {isActive ? '⚠️ Flagged' : '✓ Clear'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="person-info-footer">
            <span>📧 {person.email}</span>
            <span>🏷️ ID: {person.id}</span>
          </div>
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
