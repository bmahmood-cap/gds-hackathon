import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload Data', icon: '📤' },
    { path: '/connections', label: 'Connections Map', icon: '🔗' },
    { path: '/people', label: 'People Network', icon: '👥' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ];

  const getRoleIcon = (role: string): string => {
    const icons: Record<string, string> = {
      teacher: '👩‍🏫',
      doctor: '👨‍⚕️',
      parent: '👪',
      admin: '🔐',
    };
    return icons[role] || '👤';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-icon">🏢</span>
        <span className="brand-text">Central Data Store</span>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {user && (
        <div className="nav-user">
          <span className="user-info">
            <span className="user-icon">{getRoleIcon(user.role)}</span>
            <span className="user-name">{user.name}</span>
          </span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
