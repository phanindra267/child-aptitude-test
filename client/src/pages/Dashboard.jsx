import React from 'react';
import { Brain, Trophy, Target, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    {
      label: 'Overall Score',
      value: '92%',
      change: '+4% from last week',
      icon: <Brain size={20} />,
      iconBg: '#e0e7ff',
      iconColor: 'var(--color-primary)'
    },
    {
      label: 'Achievements',
      value: '14',
      change: '2 new badges',
      icon: <Trophy size={20} />,
      iconBg: '#fef3c7',
      iconColor: 'var(--color-accent-amber)'
    },
    {
      label: 'Tests Taken',
      value: '8',
      change: 'Across 3 categories',
      icon: <Target size={20} />,
      iconBg: '#fce7f3',
      iconColor: 'var(--color-secondary)'
    },
    {
      label: 'Study Streak',
      value: '5 Days',
      change: 'Keep it up!',
      icon: <Calendar size={20} />,
      iconBg: '#dcfce7',
      iconColor: 'var(--color-accent-emerald)'
    }
  ];

  const tasks = [
    {
      title: 'Pattern Recognition',
      time: '15 mins',
      diff: 'Medium',
      color: 'var(--color-primary)'
    },
    {
      title: 'Vocabulary Builder',
      time: '10 mins',
      diff: 'Easy',
      color: 'var(--color-accent-emerald)'
    },
    {
      title: 'Spatial Reasoning',
      time: '20 mins',
      diff: 'Hard',
      color: 'var(--color-secondary)'
    },
    {
      title: 'Number Series',
      time: '12 mins',
      diff: 'Medium',
      color: 'var(--color-accent-amber)'
    }
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, Alex</h1>
            <p>Track your child's progress and upcoming assessments.</p>
          </div>
          <Button variant="primary">
            <Brain size={18} style={{ marginRight: '0.5rem' }} />
            Start Assessment
          </Button>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">
              <TrendingUp size={14} />
              {stat.change}
            </div>
          </div>
        ))}
        </div>

        <div className="dashboard-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Performance Over Time</h3>
              <p>Track how scores across different skill areas.</p>
            </div>
            <div className="chart-placeholder">
              <p style={{ color: 'var(--color-text-muted)' }}>Chart will be here</p>
            </div>
          </div>
          <div className="tasks-card">
            <div className="chart-header">
              <h3>Recommended Tasks</h3>
              <p>Next steps for your child.</p>
            </div>
            <div className="task-list">
              {tasks.map((task, i) => (
              <div key={i} className="task-item">
                <div className="task-info">
                  <div className="task-dot" style={{ backgroundColor: task.color }}></div>
                  <div className="task-text">
                    <h4>{task.title}</h4>
                    <p>{task.time} • {task.diff}</p>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
