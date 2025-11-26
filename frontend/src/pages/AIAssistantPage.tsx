import { useState, useEffect } from 'react';
import { bedrockApi } from '../services/api';
import type { BedrockStatus, BedrockResponse } from '../types';
import './AIAssistantPage.css';

const AIAssistantPage = () => {
  const [status, setStatus] = useState<BedrockStatus | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<BedrockResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setStatusLoading(true);
      const statusData = await bedrockApi.getStatus();
      setStatus(statusData);
    } catch {
      setStatus({
        connected: false,
        mode: 'Simulated',
        message: 'Running in simulation mode - responses are pre-configured for demo purposes',
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const result = await bedrockApi.invoke({
        prompt: prompt.trim(),
        maxTokens: 500,
      });
      setResponse(result);
    } catch {
      // Use simulated response for demo
      setResponse({
        response: getSimulatedResponse(prompt),
        isSimulated: true,
        modelUsed: 'anthropic.claude-3-sonnet (simulated)',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSimulatedResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('network') || lower.includes('connection')) {
      return 'Based on the network analysis, the central data store shows strong connectivity patterns between the Engineering and Product departments. Key influencers in the network include individuals with cross-functional roles. Recommendations: 1) Foster more connections between Design and Sales teams, 2) Establish regular cross-department sync meetings.';
    }
    if (lower.includes('data') || lower.includes('store')) {
      return 'The central data store contains well-organized information across multiple categories including Database, Catalog, Analytics, HR, and Finance. Suggested optimizations: 1) Add tagging for better discoverability, 2) Implement access controls based on department, 3) Set up automated data quality checks.';
    }
    if (lower.includes('people') || lower.includes('team')) {
      return 'Your team consists of 6 members across 5 departments. The Engineering team has the most internal connections, while Sales could benefit from more cross-functional relationships. Consider organizing team-building activities between Marketing and Engineering to strengthen the product feedback loop.';
    }
    return 'I have analyzed your request. The central data store provides a comprehensive view of your organization\'s data assets and people networks. Key insights include: strong interdepartmental collaboration, well-maintained data catalogs, and clear organizational structure. Feel free to ask about specific aspects like network analysis, data management, or team connections.';
  };

  const suggestedPrompts = [
    'Analyze the network connections in my organization',
    'What insights can you provide about our data store?',
    'How can we improve team collaboration?',
    'Identify key influencers in the people network',
  ];

  return (
    <div className="ai-assistant-page">
      <header className="page-header">
        <h1>🤖 AI Assistant</h1>
        <p>Powered by AWS Bedrock - Get AI-driven insights about your data and networks</p>
      </header>

      <div className="status-card">
        {statusLoading ? (
          <div className="status-loading">Checking connection status...</div>
        ) : (
          <>
            <div className={`status-indicator ${status?.connected ? 'connected' : 'simulated'}`}>
              <span className="status-dot"></span>
              <span>{status?.mode} Mode</span>
            </div>
            <p className="status-message">{status?.message}</p>
          </>
        )}
      </div>

      <div className="assistant-content">
        <section className="chat-section">
          <form onSubmit={handleSubmit} className="prompt-form">
            <div className="input-wrapper">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me about your data, networks, or connections..."
                rows={4}
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !prompt.trim()}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <span className="send-icon">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {response && (
            <div className="response-card">
              <div className="response-header">
                <span className="response-icon">🤖</span>
                <span className="model-name">{response.modelUsed}</span>
                {response.isSimulated && (
                  <span className="simulated-badge">Demo Response</span>
                )}
              </div>
              <div className="response-body">
                <p>{response.response}</p>
              </div>
            </div>
          )}
        </section>

        <aside className="suggestions-section">
          <h3>💡 Suggested Prompts</h3>
          <div className="suggestions-list">
            {suggestedPrompts.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => setPrompt(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="info-card">
            <h4>About AWS Bedrock Integration</h4>
            <p>
              This application integrates with AWS Bedrock to provide AI-powered 
              insights about your data store and people networks. In demo mode, 
              responses are simulated to showcase the functionality.
            </p>
            <ul>
              <li>Analyze network connections</li>
              <li>Get data management recommendations</li>
              <li>Identify collaboration opportunities</li>
              <li>Generate insights from your data</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIAssistantPage;
