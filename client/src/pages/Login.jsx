import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './AuthLayout.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      {/* Left Section */}
      <div className="auth-left animate-slide-right">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <BrainCircuit size={28} />
          </div>
          <span>Aptitude</span>
        </Link>
        <div className="auth-hero">
          <h2>Welcome back</h2>
          <p>Continue your learning journey and pick up where you left off.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Check size={20} />
              </div>
              <div>
                <h4>Personalized learning</h4>
                <p>Adaptive paths tailored to your skill level.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Check size={20} />
              </div>
              <div>
                <h4>Real-time insights</h4>
                <p>Track your progress every step of the way.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="auth-right animate-slide-left">
        <div className="auth-card-wrapper">
          <div className="auth-header">
            <h1>Log in</h1>
            <p>Enter your credentials to access your account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-ghost btn-icon"
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Remember me</label>
              </div>
              <Link to="/forgot-password" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Forgot password?</Link>
            </div>

            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
              {!isLoading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
