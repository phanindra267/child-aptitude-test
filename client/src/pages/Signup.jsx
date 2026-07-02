import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './AuthLayout.css';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
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
          <h2>Start your journey</h2>
          <p>Create an account to unlock personalized learning and assessments.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="auth-right animate-slide-left">
        <div className="auth-card-wrapper">
          <div className="auth-header">
            <h1>Create account</h1>
            <p>Join thousands of learners today.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              required
            />
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
                  autoComplete="new-password"
                  required
                  minLength={8}
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
              <p className="form-helper">Must be at least 8 characters.</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
              {!isLoading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
