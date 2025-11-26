import { useState } from 'react';
import NetworkGraph from './NetworkGraph';
import SignalLogGraph from './SignalLogGraph';
import type { Person, NetworkData, Connection, Signals, SignalLogEvent, RiskScore } from '../types';
import { signalLabels, getRiskScoreColor, getRiskScoreLabel, signalEventLabels, defaultSignals } from '../utils/riskUtils';
import { mockSignalLogs } from '../data/mockData';
import './ConnectionModal.css';
import './SignalLogGraph.css';

interface ConnectionModalProps {
  person: Person;
  allPeople: Person[];
  onClose: () => void;
}

type TabType = 'connections' | 'network' | 'signals' | 'signalLog';

// Calculate risk score based on number of active signals
function calculateRiskScore(signals: Signals): RiskScore {
  const activeCount = Object.values(signals).filter(Boolean).length;
  if (activeCount >= 3) return 'red';
  if (activeCount >= 1) return 'amber';
  return 'green';
}

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
  const [signals, setSignals] = useState<Signals>({ ...person.signals });
  const [riskScore, setRiskScore] = useState<RiskScore>(() => calculateRiskScore(person.signals));
  
  // Get signal log events for this person and manage them in state
  const personSignalLog = mockSignalLogs.find(log => log.personId === person.id);
  const initialSignalLogEvents: SignalLogEvent[] = personSignalLog?.events || [];
  const [signalLogEvents, setSignalLogEvents] = useState<SignalLogEvent[]>(initialSignalLogEvents);

  const connections = generateConnections(person);
  const networkData = generateNetworkData(person, allPeople);

  const getPersonById = (id: number): Person | undefined => {
    return allPeople.find(p => p.id === id);
  };

  // Handle toggling a signal (edit)
  const handleToggleSignal = (key: keyof Signals) => {
    const newSignals = { ...signals, [key]: !signals[key] };
    setSignals(newSignals);
    setRiskScore(calculateRiskScore(newSignals));
  };

  // Handle deleting (clearing) a signal
  const handleDeleteSignal = (key: keyof Signals) => {
    const newSignals = { ...signals, [key]: false };
    setSignals(newSignals);
    setRiskScore(calculateRiskScore(newSignals));
  };

  // Handle clearing all signals
  const handleClearAllSignals = () => {
    setSignals({ ...defaultSignals });
    setRiskScore(calculateRiskScore(defaultSignals));
  };

  // Calculate risk score based on cumulative impact
  const calculateRiskScoreFromImpact = (cumulativeImpact: number): RiskScore => {
    if (cumulativeImpact >= 3) return 'red';
    if (cumulativeImpact >= 1) return 'amber';
    return 'green';
  };

  // Handle updating risk score impact for a signal log event
  const handleUpdateRiskScoreImpact = (eventId: number, newImpact: number) => {
    setSignalLogEvents(prevEvents => {
      // First, update the impact for the target event
      const updatedEvents = prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, riskScoreImpact: newImpact }
          : event
      );
      
      // Sort events by date to ensure proper recalculation
      const sortedEvents = [...updatedEvents].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Recalculate riskScoreAfter for all events based on cumulative impact
      let cumulativeImpact = 0;
      const recalculatedEvents = sortedEvents.map(event => {
        cumulativeImpact += event.riskScoreImpact;
        return {
          ...event,
          riskScoreAfter: calculateRiskScoreFromImpact(cumulativeImpact)
        };
      });
      
      return recalculatedEvents;
    });
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
          <button
            className={`modal-tab ${activeTab === 'signalLog' ? 'active' : ''}`}
            onClick={() => setActiveTab('signalLog')}
          >
            <span className="tab-icon">📋</span>
            Signal Log
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
                      background: getRiskScoreColor(riskScore),
                      boxShadow: `0 0 12px ${getRiskScoreColor(riskScore)}40`
                    }}
                  >
                    {getRiskScoreLabel(riskScore)}
                  </div>
                </div>
                <p>The following signals contribute to {person.name}'s risk score.</p>
                <button 
                  className="clear-all-signals-btn"
                  onClick={handleClearAllSignals}
                >
                  🗑️ Clear All Signals
                </button>
              </div>
              
              <div className="signals-list">
                {(Object.keys(signalLabels) as Array<keyof Signals>).map((key) => {
                  const isActive = signals[key];
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
                      <div className="signal-actions">
                        <button 
                          className="signal-edit-btn"
                          onClick={() => handleToggleSignal(key)}
                          title={isActive ? 'Clear this signal' : 'Flag this signal'}
                        >
                          ✏️
                        </button>
                        {isActive && (
                          <button 
                            className="signal-delete-btn"
                            onClick={() => handleDeleteSignal(key)}
                            title="Delete this signal"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'signalLog' && (
            <div className="signal-log-tab">
              <div className="signal-log-header">
                <h3>Signal Log Timeline</h3>
                <p>Life events affecting {person.name}'s risk assessment over time.</p>
              </div>
              
              {signalLogEvents.length > 0 ? (
                <>
                  <div className="signal-log-graph-section">
                    <h4>📈 Risk Score Over Time</h4>
                    <SignalLogGraph events={signalLogEvents} width={680} height={280} />
                  </div>
                  
                  <div className="signal-log-events">
                    <h4>📋 Event Timeline</h4>
                    <div className="event-timeline">
                      {[...signalLogEvents].reverse().map((event) => {
                        const eventLabel = signalEventLabels[event.eventType];
                        const impactClass = event.riskScoreImpact > 0 
                          ? 'positive' 
                          : event.riskScoreImpact < 0 
                            ? 'negative' 
                            : 'neutral';
                        const impactText = event.riskScoreImpact > 0 
                          ? `+${event.riskScoreImpact} risk increase`
                          : event.riskScoreImpact < 0 
                            ? `${event.riskScoreImpact} risk decrease`
                            : 'No change';
                        
                        return (
                          <div 
                            key={event.id} 
                            className={`timeline-event risk-${event.riskScoreAfter}`}
                          >
                            <div className="event-header">
                              <span className="event-type">
                                <span className="event-icon">{eventLabel.icon}</span>
                                {eventLabel.label}
                              </span>
                              <span className="event-date">
                                {new Date(event.date).toLocaleDateString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                            <p className="event-description">{event.description}</p>
                            <div className="event-impact">
                              <div className="impact-edit-section">
                                <span className="impact-label">Risk Impact:</span>
                                <div className="impact-controls">
                                  <button 
                                    className="impact-btn decrease"
                                    onClick={() => handleUpdateRiskScoreImpact(event.id, event.riskScoreImpact - 1)}
                                    title="Decrease risk impact"
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    className="impact-input"
                                    value={event.riskScoreImpact}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const parsed = value === '' ? 0 : parseInt(value, 10);
                                      handleUpdateRiskScoreImpact(event.id, isNaN(parsed) ? 0 : parsed);
                                    }}
                                  />
                                  <button 
                                    className="impact-btn increase"
                                    onClick={() => handleUpdateRiskScoreImpact(event.id, event.riskScoreImpact + 1)}
                                    title="Increase risk impact"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className={`impact-badge ${impactClass}`}>
                                  {impactText}
                                </span>
                              </div>
                              <span className={`risk-indicator ${event.riskScoreAfter}`}>
                                → {getRiskScoreLabel(event.riskScoreAfter)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-data">
                  <span>📋</span>
                  <p>No signal log events recorded for this person</p>
                </div>
              )}
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
