import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Data Store', icon: '📊' },
    { path: '/upload', label: 'Upload Data', icon: '📤' },
    { path: '/connections', label: 'Connections Map', icon: '🔗' },
    { path: '/people', label: 'People Network', icon: '👥' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ];

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
    </nav>
  );
};

export default Navigation;
