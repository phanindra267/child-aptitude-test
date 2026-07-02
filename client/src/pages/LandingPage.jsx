import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, Target, BookOpen, Zap, TrendingUp, ArrowRight, Play, Plus, Minus, User, Users, Building2, Award, Shield, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { icon: <BrainCircuit size={24} />, title: 'Adaptive Learning', description: 'AI-powered assessments that adapt to your child\'s skill level in real time.' },
    { icon: <Target size={24} />, title: 'Personalized Goals', description: 'Custom learning paths designed to help each child reach their full potential.' },
    { icon: <BookOpen size={24} />, title: 'Comprehensive Reports', description: 'Clear, actionable insights that guide parents and educators.' },
    { icon: <Zap size={24} />, title: 'Engaging Experience', description: 'Gamified interface that keeps children motivated and excited to learn.' },
    { icon: <TrendingUp size={24} />, title: 'Progress Tracking', description: 'Monitor growth over time with detailed analytics and milestones.' },
    { icon: <Sparkles size={24} />, title: 'Curated Content', description: 'Expertly designed questions that challenge and inspire young minds.' }
  ];

  const testimonials = [
    { quote: "My son's confidence has skyrocketed since we started using Aptitude. The assessments feel like games, and the reports help me understand exactly what to focus on.", author: { initials: 'SM', name: 'Sarah Mitchell', role: 'Parent of 8-year-old' } },
    { quote: "The adaptive learning engine is remarkable. It truly understands each student's strengths and weaknesses. A game-changer for my classroom.", author: { initials: 'JD', name: 'James Davis', role: 'Elementary School Teacher' } }
  ];

  const trustedBy = [
    { name: 'Bright Futures Academy' },
    { name: 'Sunnydale Elementary' },
    { name: 'Future Leaders Prep' },
    { name: 'Learning Bridge Schools' },
    { name: 'Education First Network' }
  ];

  const howItWorks = [
    { step: 1, icon: <User size={24} />, title: 'Sign Up', description: 'Create an account in minutes and tell us a little about your child.' },
    { step: 2, icon: <BrainCircuit size={24} />, title: 'AI Assessment', description: 'Your child takes a fun, adaptive assessment to identify their strengths.' },
    { step: 3, icon: <FileText size={24} />, title: 'Personalized Analysis', description: 'Get detailed insights into your child\'s cognitive abilities and skill gaps.' },
    { step: 4, icon: <BookOpen size={24} />, title: 'Learning Plan', description: 'Receive a custom learning path tailored to your child\'s unique needs.' },
    { step: 5, icon: <TrendingUp size={24} />, title: 'Progress Tracking', description: 'Monitor growth, celebrate achievements, and adjust goals along the way.' }
  ];

  const faqItems = [
    { question: 'How long do the assessments take?', answer: 'Most assessments take between 15 to 30 minutes, depending on the child\'s age and skill level.' },
    { question: 'Is my child\'s data secure?', answer: 'Absolutely! We follow strict privacy guidelines, encrypt all data, and never share information without explicit consent.' },
    { question: 'Can I use Aptitude for multiple children?', answer: 'Yes! Our Family plan supports up to 5 child profiles, each with their own personalized learning paths.' },
    { question: 'Do you offer school discounts?', answer: 'Yes, we have special pricing for schools and districts. Contact our sales team for more details.' },
    { question: 'What age groups is Aptitude for?', answer: 'Aptitude is designed for children ages 5 to 16, with age-appropriate assessments and learning content.' }
  ];

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <BrainCircuit size={20} />
            </div>
            <span>Aptitude</span>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-actions">
            <Button variant="ghost" as={Link} to="/login">Log in</Button>
            <Button variant="primary" as={Link} to="/signup">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid animate-fade-in">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              <span>Trusted by 10,000+ parents and educators</span>
            </div>
            <h1 className="hero-title">
              Discover your child's <span>cognitive potential</span>
            </h1>
            <p className="hero-desc">
              A premium, AI-powered platform designed by educators to identify strengths, build confidence, and nurture growth through adaptive assessments and personalized learning paths.
            </p>
            <div className="hero-cta">
              <Button variant="primary" size="lg" as={Link} to="/signup">
                Start Free Assessment <ArrowRight size={18} />
              </Button>
              <Button variant="secondary" size="lg">
                <Play size={18} /> Watch Demo
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-card">
              <div className="hero-visual-shape"></div>
              <div className="hero-visual-content">
                <div className="hero-visual-demo">
                  {[
                    { icon: <BrainCircuit size={20} />, title: 'Logical', value: '92%', color: 'var(--primary-100)', colorIcon: 'var(--primary-600)' },
                    { icon: <TrendingUp size={20} />, title: 'Verbal', value: '87%', color: 'var(--secondary-100)', colorIcon: 'var(--secondary-600)' },
                    { icon: <Target size={20} />, title: 'Spatial', value: '95%', color: 'var(--success-50)', colorIcon: 'var(--success)' },
                    { icon: <Sparkles size={20} />, title: 'Creative', value: '89%', color: 'var(--warning-50)', colorIcon: 'var(--warning)' }
                  ].map((item, i) => (
                    <div key={i} className="hero-visual-item">
                      <div className="hero-visual-item-icon" style={{ backgroundColor: item.color, color: item.colorIcon }}>
                        {item.icon}
                      </div>
                      <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted-by">
        <div className="container">
          <div className="trusted-intro">
            <p>Trusted by leading schools and educators worldwide</p>
          </div>
          <div className="trusted-logos">
            {trustedBy.map((logo, i) => (
              <div key={i} className="trusted-logo">
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="how-it-works-intro">
            <h2>How Aptitude works</h2>
            <p>Our simple 5-step process helps your child discover and grow their cognitive abilities.</p>
          </div>
          <div className="how-it-works-grid">
            {howItWorks.map((step, i) => (
              <div key={i} className="how-step animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="how-step-number">{step.step}</div>
                <div className="how-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <div className="features-intro animate-fade-in">
            <h2>Everything you need for your child's growth</h2>
            <p>From adaptive assessments to detailed progress reports, we've got you covered.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="features-intro">
            <h2>Loved by parents and teachers</h2>
            <p>See what our community has to say about their experience.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="testimonial">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.author.initials}</div>
                  <div className="testimonial-author-info">
                    <h4>{testimonial.author.name}</h4>
                    <p>{testimonial.author.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq">
        <div className="container">
          <div className="faq-intro">
            <h2>Frequently asked questions</h2>
            <p>Find answers to common questions about Aptitude.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <h4>{faq.question}</h4>
                  {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="nav-logo-icon">
                  <BrainCircuit size={20} />
                </div>
                <span>Aptitude</span>
              </div>
              <p>Nurturing young minds through intelligent, personalized learning experiences.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#">Pricing</a>
              <a href="#">For Schools</a>
              <a href="#">For Parents</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Aptitude. All rights reserved.</p>
            <div>Made with care for every child.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
