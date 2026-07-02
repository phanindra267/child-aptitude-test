import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, Target, BookOpen, Settings, Bell, Search } from 'lucide-react';
import './Layout.css';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Assessments', icon: Target, path: '/assessments' },
    { name: 'Study Plan', icon: BookOpen, path: '/study-plan' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')}>
        <div className="sidebar-logo-icon">
          <BrainCircuit size={20} />
        </div>
        <span>Aptitude</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div 
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AS</div>
          <div className="sidebar-user-info">
            <h4>Alex Smith</h4>
            <p>Parent</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
        <input placeholder="Search assessments, reports..." />
      </div>
      
      <div className="topbar-actions">
        <button className="btn btn-ghost" style={{ padding: '0.5rem' }}>
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}

export default function Layout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Topbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
