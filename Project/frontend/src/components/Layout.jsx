// Left sidebar + page area (<Outlet /> is where the current page renders)
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [['/', '📊 Dashboard'], ['/electricity', '⚡ Electricity'], ['/gas', '🔥 Gas'], ['/water', '💧 Water']];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Meter Portal</h2>
        <nav>{links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
        ))}</nav>
        <div className="side-foot">
          <div>{user.name}<br /><span className="muted light">{user.role}</span></div>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}
