import type { RiskScore, Signals } from '../types';

export const defaultSignals: Signals = {
  previousHomelessness: false,
  temporaryAccommodation: false,
  careStatus: false,
  parentalSubstanceAbuse: false,
  parentalCrimes: false,
  youthJustice: false,
  educationStatus: false,
};

export function getRiskScoreColor(riskScore: RiskScore): string {
  const colors: Record<RiskScore, string> = {
    red: '#e53e3e',
    amber: '#ed8936',
    green: '#48bb78',
  };
  return colors[riskScore];
}

export function getRiskScoreLabel(riskScore: RiskScore): string {
  const labels: Record<RiskScore, string> = {
    red: 'High Risk',
    amber: 'Medium Risk',
    green: 'Low Risk',
  };
  return labels[riskScore];
}

export const signalLabels: Record<keyof Signals, { label: string; icon: string }> = {
  previousHomelessness: { label: 'Previous Homelessness', icon: '🏠' },
  temporaryAccommodation: { label: 'Temporary Accommodation', icon: '🏨' },
  careStatus: { label: 'Care Status', icon: '👶' },
  parentalSubstanceAbuse: { label: 'Parental Substance Abuse', icon: '⚠️' },
  parentalCrimes: { label: 'Parental Crimes', icon: '🚨' },
  youthJustice: { label: 'Youth Justice', icon: '⚖️' },
  educationStatus: { label: 'Education Status', icon: '📚' },
};
