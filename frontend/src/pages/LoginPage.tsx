import { useAuth } from '../contexts/useAuth';
import { mockUsers } from '../data/mockData';
import type { User, UserRole } from '../types';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      housing_officer: '🏠',
      social_worker: '👩‍⚕️',
      youth_worker: '🤝',
      admin: '🔐',
    };
    return icons[role];
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      housing_officer: 'Housing Officer',
      social_worker: 'Social Worker',
      youth_worker: 'Youth Worker',
      admin: 'Administrator',
    };
    return labels[role];
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
      housing_officer: 'Manage housing cases and at-risk individuals',
      social_worker: 'Support vulnerable children and families',
      youth_worker: 'Engage with young people at risk',
      admin: 'Full system access',
    };
    return descriptions[role];
  };

  const handleLogin = (user: User) => {
    login(user);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-icon">🏡</span>
          <h1>Signify</h1>
          <p>Early Homelessness Prevention for Young People</p>
        </div>

        <div className="user-profiles">
          {mockUsers.map((user) => (
            <button
              key={user.id}
              className="user-profile-card"
              onClick={() => handleLogin(user)}
            >
              <div className="profile-avatar">
                {getRoleIcon(user.role)}
              </div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <span className="profile-role">{getRoleLabel(user.role)}</span>
                <p className="profile-description">{getRoleDescription(user.role)}</p>
              </div>
              <div className="profile-connections">
                <span className="connection-count">{user.connectionIds.length}</span>
                <span className="connection-label">cases</span>
              </div>
            </button>
          ))}
        </div>

        <div className="login-footer">
          <p>Demo application for local council employees</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
