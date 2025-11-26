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
    if (lower.includes('risk') || lower.includes('at-risk') || lower.includes('vulnerable')) {
      return 'Based on the risk analysis, there are several young people showing early warning signs of homelessness. Key indicators include: family breakdown, school exclusion, and care leaver status. Recommendations: 1) Prioritise engagement with Tyler Wilson and Noah Anderson who show multiple risk factors, 2) Strengthen family mediation services, 3) Ensure care leavers have housing plans 6 months before leaving care.';
    }
    if (lower.includes('network') || lower.includes('connection') || lower.includes('relationship')) {
      return 'The relationship network shows strong cross-agency collaboration between Housing Officers, Social Workers, and Youth Workers. Key observations: Tyler Wilson has good support coverage with connections to multiple services. Recommendations: 1) Establish regular multi-agency meetings for high-risk cases, 2) Ensure family members are engaged in support plans, 3) Consider peer mentoring programmes connecting care leavers with at-risk youth.';
    }
    if (lower.includes('housing') || lower.includes('accommodation')) {
      return 'Housing analysis indicates several individuals require urgent accommodation support. Current caseload shows 3 young people in Youth Housing category and 2 Care Leavers needing housing transition support. Recommendations: 1) Explore supported lodgings options for 16-17 year olds, 2) Fast-track housing applications for care leavers approaching 18, 3) Develop partnerships with local housing associations for young person-specific accommodation.';
    }
    if (lower.includes('prevention') || lower.includes('early intervention')) {
      return 'Early intervention strategies should focus on: 1) School-based identification of at-risk students through attendance and behaviour monitoring, 2) Family mediation services to resolve housing-related conflicts, 3) Financial literacy and budgeting support for young people approaching independence, 4) Mental health support services integrated into housing support packages. The data suggests intervention is most effective when initiated 6-12 months before a potential crisis point.';
    }
    return 'I have analysed the Signify data for homelessness prevention insights. The system contains records of at-risk young people, their family networks, and support worker relationships. Key areas to explore include: risk assessments, relationship mapping, housing support pathways, and early intervention opportunities. Feel free to ask about specific individuals, risk factors, or prevention strategies.';
  };

  const suggestedPrompts = [
    'Identify young people at highest risk of homelessness',
    'Analyse the support network for at-risk youth',
    'What housing options are available for care leavers?',
    'Suggest early intervention strategies',
  ];

  return (
    <div className="ai-assistant-page">
      <header className="page-header">
        <h1>🤖 AI Assistant</h1>
        <p>Powered by AWS Bedrock - Get AI-driven insights for homelessness prevention</p>
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
                placeholder="Ask about risk factors, support networks, or intervention strategies..."
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
                    Analysing...
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
            <h4>About Signify AI</h4>
            <p>
              This AI assistant helps local council employees identify risk factors 
              and intervention opportunities for preventing youth homelessness. 
              In demo mode, responses are simulated to showcase the functionality.
            </p>
            <ul>
              <li>Analyse risk factors for individuals</li>
              <li>Map support networks and relationships</li>
              <li>Identify early intervention opportunities</li>
              <li>Get housing pathway recommendations</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIAssistantPage;
