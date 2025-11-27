import type { RiskScore, Signals, SignalEventType, SignalAction } from '../types';

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
    amber: '#f97316',
    green: '#eab308',
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

export const signalEventLabels: Record<SignalEventType, { label: string; icon: string }> = {
  moving_house: { label: 'Moving House', icon: '🏠' },
  temporary_accommodation: { label: 'Placed in Temporary Accommodation', icon: '🏨' },
  death_of_loved_one: { label: 'Death of a Loved One', icon: '💔' },
  expelled: { label: 'Expelled from School', icon: '🚫' },
  arrested: { label: 'Arrested', icon: '🚔' },
  family_breakdown: { label: 'Family Breakdown', icon: '👪' },
  job_loss: { label: 'Job Loss', icon: '💼' },
  mental_health_crisis: { label: 'Mental Health Crisis', icon: '🧠' },
  substance_abuse_incident: { label: 'Substance Abuse Incident', icon: '⚠️' },
  care_placement_change: { label: 'Care Placement Change', icon: '🔄' },
};

// Available actions for each signal event type
export const signalEventActions: Record<SignalEventType, SignalAction[]> = {
  moving_house: [
    { id: 'housing_support', label: 'Housing Support Assessment', icon: '🏠', category: 'support' },
    { id: 'housing_referral', label: 'Refer to Housing Services', icon: '📋', category: 'referral' },
    { id: 'settle_in_visit', label: 'Schedule Settle-in Visit', icon: '📅', category: 'monitoring' },
  ],
  temporary_accommodation: [
    { id: 'emergency_housing', label: 'Emergency Housing Review', icon: '🏨', category: 'intervention' },
    { id: 'housing_list', label: 'Add to Housing Waiting List', icon: '📝', category: 'referral' },
    { id: 'support_package', label: 'Arrange Support Package', icon: '🤝', category: 'support' },
    { id: 'weekly_check', label: 'Weekly Check-in Calls', icon: '📞', category: 'monitoring' },
  ],
  death_of_loved_one: [
    { id: 'bereavement_counselling', label: 'Bereavement Counselling Referral', icon: '💬', category: 'referral' },
    { id: 'peer_support', label: 'Connect with Peer Support Group', icon: '👥', category: 'support' },
    { id: 'welfare_check', label: 'Schedule Welfare Check', icon: '🏥', category: 'monitoring' },
  ],
  expelled: [
    { id: 'education_plan', label: 'Create Alternative Education Plan', icon: '📚', category: 'intervention' },
    { id: 'education_referral', label: 'Refer to Education Support', icon: '🎓', category: 'referral' },
    { id: 'youth_mentor', label: 'Assign Youth Mentor', icon: '🤝', category: 'support' },
    { id: 'progress_review', label: 'Schedule Progress Review', icon: '📊', category: 'monitoring' },
  ],
  arrested: [
    { id: 'legal_support', label: 'Arrange Legal Support', icon: '⚖️', category: 'support' },
    { id: 'youth_justice_referral', label: 'Youth Justice Team Referral', icon: '👮', category: 'referral' },
    { id: 'risk_assessment', label: 'Conduct Risk Assessment', icon: '📋', category: 'intervention' },
    { id: 'regular_contact', label: 'Establish Regular Contact', icon: '📞', category: 'monitoring' },
  ],
  family_breakdown: [
    { id: 'family_mediation', label: 'Family Mediation Referral', icon: '👪', category: 'referral' },
    { id: 'emergency_placement', label: 'Arrange Emergency Placement', icon: '🏠', category: 'intervention' },
    { id: 'counselling', label: 'Individual Counselling', icon: '💬', category: 'support' },
    { id: 'safety_plan', label: 'Create Safety Plan', icon: '🛡️', category: 'intervention' },
  ],
  job_loss: [
    { id: 'job_centre', label: 'Job Centre Referral', icon: '💼', category: 'referral' },
    { id: 'benefits_advice', label: 'Benefits Advice Session', icon: '💰', category: 'support' },
    { id: 'training_program', label: 'Enrol in Training Programme', icon: '📖', category: 'support' },
    { id: 'financial_review', label: 'Financial Situation Review', icon: '📊', category: 'monitoring' },
  ],
  mental_health_crisis: [
    { id: 'camhs_referral', label: 'CAMHS Referral', icon: '🧠', category: 'referral' },
    { id: 'crisis_intervention', label: 'Crisis Intervention Team', icon: '🚨', category: 'intervention' },
    { id: 'counselling_service', label: 'Counselling Service Referral', icon: '💬', category: 'referral' },
    { id: 'daily_check', label: 'Daily Check-in Protocol', icon: '📞', category: 'monitoring' },
  ],
  substance_abuse_incident: [
    { id: 'substance_service', label: 'Substance Misuse Service Referral', icon: '🏥', category: 'referral' },
    { id: 'harm_reduction', label: 'Harm Reduction Support', icon: '⚠️', category: 'support' },
    { id: 'peer_mentor', label: 'Connect with Peer Mentor', icon: '🤝', category: 'support' },
    { id: 'regular_testing', label: 'Regular Testing Schedule', icon: '📋', category: 'monitoring' },
  ],
  care_placement_change: [
    { id: 'placement_review', label: 'Placement Stability Review', icon: '🔄', category: 'intervention' },
    { id: 'key_worker', label: 'Assign Key Worker', icon: '👤', category: 'support' },
    { id: 'life_story_work', label: 'Life Story Work Sessions', icon: '📖', category: 'support' },
    { id: 'transition_support', label: 'Transition Support Plan', icon: '📋', category: 'intervention' },
  ],
};

// Get action by ID
export function getActionById(eventType: SignalEventType, actionId: string): SignalAction | undefined {
  return signalEventActions[eventType]?.find(action => action.id === actionId);
}

// Get action category color
export function getActionCategoryColor(category: SignalAction['category']): string {
  const colors: Record<SignalAction['category'], string> = {
    support: '#48bb78',      // Green - supportive actions
    referral: '#667eea',     // Blue - referrals to services
    intervention: '#ed8936', // Orange - active interventions
    monitoring: '#9f7aea',   // Purple - monitoring/tracking
  };
  return colors[category];
}

// Get action category label
export function getActionCategoryLabel(category: SignalAction['category']): string {
  const labels: Record<SignalAction['category'], string> = {
    support: 'Support',
    referral: 'Referral',
    intervention: 'Intervention',
    monitoring: 'Monitoring',
  };
  return labels[category];
}
