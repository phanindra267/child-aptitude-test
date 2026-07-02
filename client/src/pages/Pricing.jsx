import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started with basic assessments',
    features: [
      '3 free assessments per month',
      'Basic analytics dashboard',
      '1 child profile',
      'Email support'
    ],
    cta: 'Get started'
  },
  {
    name: 'Family',
    price: '$19',
    period: 'per month',
    desc: 'Ideal for families with multiple children',
    features: [
      'Unlimited assessments',
      'Advanced analytics & reports',
      'Up to 5 child profiles',
      'Priority email support',
      'Printable certificates'
    ],
    popular: true,
    cta: 'Start free trial'
  },
  {
    name: 'School',
    price: '$99',
    period: 'per month',
    desc: 'For educators and school administrators',
    features: [
      'Unlimited students & assessments',
      'School-wide analytics',
      'Teacher & admin roles',
      'Dedicated account manager',
      'Custom integrations'
    ],
    cta: 'Contact sales'
  }
];

export default function Pricing() {
  return (
    <div className="pricing">
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <BrainCircuit size={20} />
            </div>
            <span>Aptitude</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div className="nav-actions">
            <Button variant="ghost" as={Link} to="/login">Log in</Button>
            <Button variant="primary" as={Link} to="/signup">Sign up</Button>
          </div>
        </div>
      </nav>

      <section className="pricing-section">
        <div className="container">
          <div className="pricing-intro">
            <h1>Simple, transparent pricing</h1>
            <p>Choose the perfect plan for your child's learning journey. No hidden fees, cancel anytime.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="plan-badge">Most popular</div>}
                <h2 className="plan-name">{plan.name}</h2>
                <div className="plan-price">{plan.price} <span>{plan.period}</span></div>
                <p className="plan-desc">{plan.desc}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, j) => (
                    <li key={j}>
                      <Check size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="lg"
                  className="plan-cta"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© 2025 Aptitude. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
