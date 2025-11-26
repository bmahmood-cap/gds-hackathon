import { useAuth } from '../contexts/useAuth';
import { mockUsers } from '../data/mockData';
import type { User, UserRole } from '../types';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      teacher: '👩‍🏫',
      doctor: '👨‍⚕️',
      parent: '👪',
      admin: '🔐',
    };
    return icons[role];
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      teacher: 'Teacher',
      doctor: 'Doctor',
      parent: 'Parent',
      admin: 'Administrator',
    };
    return labels[role];
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
      teacher: 'View students in your class',
      doctor: 'Access patient records',
      parent: 'See your children\'s information',
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
          <span className="login-icon">🏢</span>
          <h1>Central Data Store</h1>
          <p>Select a user profile to continue</p>
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
                <span className="connection-label">connections</span>
              </div>
            </button>
          ))}
        </div>

        <div className="login-footer">
          <p>This is a demo application with mocked authentication</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
