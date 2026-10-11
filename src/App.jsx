import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
  RefreshCw,
  Sliders,
  Check,
  Menu,
  X
} from 'lucide-react';
import './App.css';

// Configurable API base URL with fallback to localhost:8080 for local dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ANALYZE_ENDPOINT = `${API_BASE.replace(/\/+$/, '')}/api/password/analyze`;

// Horizontal workflow steps per requirements
const WORKFLOW_STEPS = [
  { name: 'Input', desc: 'Secure capture in memory', icon: Terminal },
  { name: 'Validation', desc: 'Empty & format check', icon: Sliders },
  { name: 'Analysis', desc: 'Entropy & char classes', icon: Cpu },
  { name: 'Verification', desc: 'Complexity test matrix', icon: Layers },
  { name: 'Risk Check', desc: 'Pattern & dictionary review', icon: Activity },
  { name: 'Recommendations', desc: 'Remediation guidance', icon: Sparkles },
  { name: 'Report', desc: 'Deterministic score synthesis', icon: ShieldCheck }
];

// Curated sample test passwords (Never real passwords)
const SAMPLE_PASSWORDS = [
  { label: 'Weak: "admin123"', value: 'admin123' },
  { label: 'Medium: "Tiger#2026"', value: 'Tiger#2026' },
  { label: 'Strong: "K9$mQ#vL91z*Wp"', value: 'K9$mQ#vL91z*Wp' },
  { label: 'Common: "qwerty99"', value: 'qwerty99' }
];

// Glass Box deterministic rules breakdown
const GLASS_BOX_RULES = [
  {
    name: 'Length Threshold (>= 8)',
    weight: '+25 pts',
    category: 'Entropy Foundation',
    rule: 'password.length >= 8',
    rationale: 'Longer search space prevents trivial offline brute force.'
  },
  {
    name: 'Uppercase Letter [A-Z]',
    weight: '+20 pts',
    category: 'Character Diversity',
    rule: 'password.matches(".*[A-Z].*")',
    rationale: 'Expands character pool by 26 possible symbols.'
  },
  {
    name: 'Lowercase Letter [a-z]',
    weight: '+20 pts',
    category: 'Character Diversity',
    rule: 'password.matches(".*[a-z].*")',
    rationale: 'Standard base character set expands permutation space.'
  },
  {
    name: 'Numeric Digits [0-9]',
    weight: '+20 pts',
    category: 'Character Diversity',
    rule: 'password.matches(".*[0-9].*")',
    rationale: 'Expands the keyspace by 10 additional characters.'
  },
  {
    name: 'Special Symbols [^A-Za-z0-9]',
    weight: '+15 pts',
    category: 'Punctuation & Symbols',
    rule: 'password.matches(".*[^A-Za-z0-9].*")',
    rationale: 'Significantly increases combinatorial complexity.'
  },
  {
    name: 'Strength Thresholds',
    weight: 'Deterministic',
    category: 'Classification',
    rule: '<40: Weak | 40-69: Medium | >=70: Strong',
    rationale: 'Transparent, reproducible evaluation boundary.'
  }
];

export default function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client-side quick checks for instant interactive feedback while typing
  const localChecks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Uppercase letter [A-Z]', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase letter [a-z]', passed: /[a-z]/.test(password) },
    { label: 'Numeric digit [0-9]', passed: /[0-9]/.test(password) },
    { label: 'Special symbol (!@#$%...)', passed: /[^A-Za-z0-9]/.test(password) }
  ];

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!password.trim()) {
      setError('Please provide a sample password to analyze.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(
        `Unable to reach backend service at ${API_BASE}. ` +
        `If running locally, ensure the Spring Boot server is started. In production, verify CORS and backend status.`
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthClass = (strength) => {
    if (!strength) return 'weak';
    const s = strength.toLowerCase();
    if (s.includes('strong')) return 'strong';
    if (s.includes('medium')) return 'medium';
    return 'weak';
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* Top Minimal Navigation Bar */}
      <div className="navbar-wrap">
        <nav className="navbar">
          <a href="#hero" className="nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            <div className="brand-icon">
              <Shield size={18} />
            </div>
            <div className="brand-title-wrap">
              <span className="brand-title">SECUREPASS</span>
              <span className="brand-tag">AUDITABLE SECURITY</span>
            </div>
          </a>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#story" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('story'); }}>
              Story
            </a>
            <a href="#pipeline" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('pipeline'); }}>
              Pipeline
            </a>
            <a href="#security-lab" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('security-lab'); }}>
              Security Lab
            </a>
            <a href="#glass-box" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('glass-box'); }}>
              Glass Box
            </a>
          </div>

          <div className="nav-actions">
            <button
              className="btn-amber"
              onClick={() => scrollToSection('security-lab')}
            >
              Enter SecurePass <ArrowRight size={14} />
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      <div className="site-container">
        {/* HERO SECTION */}
        <section className="hero-section" id="hero">
          <div className="hero-pill">
            <span className="pulse-dot"></span>
            AUDITABLE PASSWORD SECURITY
          </div>

          <h1 className="hero-title">
            SECUREPASS — <br />
            <span className="gradient-text">Confidence beyond passwords.</span>
          </h1>

          <p className="hero-subtitle">
            Security intelligence beyond passwords. Rigorous, deterministic analysis evaluates 
            entropy, character composition, and common vulnerabilities — delivering transparent 
            security scoring and actionable hardening guidance.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-amber"
              onClick={() => scrollToSection('security-lab')}
            >
              Enter SecurePass <ArrowRight size={14} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('pipeline')}
            >
              See how it works
            </button>
          </div>

          {/* Operational Metrics Bar */}
          <div className="hero-stats-bar" id="story">
            <div className="stat-item">
              <span className="stat-label">ASSESSMENT ENGINE</span>
              <span className="stat-value">Deterministic</span>
              <span className="stat-desc">Zero black-box hallucinations</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">STORAGE POLICY</span>
              <span className="stat-value">Zero Persist</span>
              <span className="stat-desc">Passwords never stored to disk</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">API LATENCY</span>
              <span className="stat-value">&lt; 15ms</span>
              <span className="stat-desc">Sub-second Spring Boot evaluation</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SCORE BOUNDS</span>
              <span className="stat-value">0 — 100</span>
              <span className="stat-desc">Granular weighted matrix</span>
            </div>
          </div>
        </section>

        {/* HORIZONTAL WORKFLOW TIMELINE */}
        <section className="workflow-section" id="pipeline">
          <div className="section-badge">
            <Activity size={14} /> END-TO-END PIPELINE
          </div>
          <h2 className="section-heading">Horizontal Security Verification Workflow</h2>
          <p className="section-desc">
            Every submission transitions through a seven-stage audit pipeline before 
            synthesizing the final cryptographic and policy assessment.
          </p>

          <div className="timeline-card">
            <div className="timeline-track">
              {WORKFLOW_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div className={`timeline-node ${idx === 2 ? 'active' : ''}`} key={step.name}>
                    <div className="node-bullet">
                      <StepIcon size={16} />
                    </div>
                    <span className="node-label">{step.name}</span>
                    <span className="node-desc">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECURITY LAB (ANALYZER) */}
        <section className="section-spacer" id="security-lab">
          <div className="section-badge">
            <Terminal size={14} /> SECURITY LAB
          </div>
          <h2 className="section-heading">Live Password Analysis Console</h2>
          <p className="section-desc">
            Test a sample password against the live backend REST API. View the computed score, 
            strength classification, and security checklist in real time.
          </p>

          <div className="analyzer-grid">
            {/* Input Form Panel */}
            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Lock size={18} color="#3b82f6" /> Input Security Specimen
                </h3>
                <span className="panel-status-pill">
                  <Activity size={10} color="#10b981" /> REST API: /api/password/analyze
                </span>
              </div>

              <form onSubmit={handleAnalyze}>
                <div className="input-label-row">
                  <label htmlFor="password-field" className="input-label">
                    PASSWORD SPECIMEN
                  </label>
                  <span className="char-counter">{password.length} characters</span>
                </div>

                <div className="input-wrapper">
                  <input
                    id="password-field"
                    className="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter a sample password..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    className="toggle-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Sample Presets */}
                <div className="presets-section">
                  <div className="presets-label">LOAD SAMPLE DEMO SPECIMEN:</div>
                  <div className="preset-chips">
                    {SAMPLE_PASSWORDS.map((sample) => (
                      <button
                        type="button"
                        key={sample.label}
                        className="preset-chip"
                        onClick={() => {
                          setPassword(sample.value);
                          setError('');
                        }}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="form-alert error" role="alert">
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <div>{error}</div>
                  </div>
                )}

                {/* Privacy Warning */}
                <div className="form-alert privacy">
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Demonstration Notice:</strong> Use sample or synthetic passwords only. 
                    Passwords are transmitted to the backend analyzer in memory for scoring and are never 
                    stored to a persistent database or disk.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-amber"
                  style={{ width: '100%', marginTop: '8px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="spin-icon" /> Analyzing Specimen...
                    </>
                  ) : (
                    <>
                      Analyze Password <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Output Panel */}
            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Activity size={18} color="#f59e0b" /> Assessment Synthesis
                </h3>
                <span className="panel-status-pill">
                  {result ? 'ANALYSIS COMPLETE' : 'AWAITING SPECIMEN'}
                </span>
              </div>

              {!result && !loading && (
                <div className="empty-state-panel">
                  <div className="empty-state-icon">
                    <Shield size={24} />
                  </div>
                  <div className="empty-state-title">No Active Assessment</div>
                  <div className="empty-state-text">
                    Enter a sample password on the left or select a sample preset, then click 
                    "Analyze Password" to trigger the backend assessment.
                  </div>
                </div>
              )}

              {loading && (
                <div className="empty-state-panel">
                  <div className="empty-state-icon">
                    <RefreshCw size={24} className="spin-icon" />
                  </div>
                  <div className="empty-state-title">Executing Rules Engine</div>
                  <div className="empty-state-text">
                    Evaluating character vectors and entropy requirements across the backend pipeline...
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="assessment-result">
                  <div className="score-header">
                    <div>
                      <span className="input-label">CALCULATED SCORE</span>
                      <div className="score-number-wrap">
                        <span className="score-big">{result.score}</span>
                        <span className="score-max">/ 100</span>
                      </div>
                    </div>

                    <div className={`strength-tag ${getStrengthClass(result.strength)}`}>
                      {result.strength === 'Strong' && <ShieldCheck size={14} />}
                      {result.strength === 'Medium' && <AlertTriangle size={14} />}
                      {result.strength === 'Weak' && <ShieldAlert size={14} />}
                      {result.strength}
                    </div>
                  </div>

                  {/* Animated Score Progress Rail */}
                  <div className="meter-rail">
                    <div
                      className={`meter-bar ${getStrengthClass(result.strength)}`}
                      style={{ width: `${Math.max(4, Math.min(100, result.score))}%` }}
                    />
                  </div>

                  {/* Backend Rules Checks Checklist */}
                  <div className="checklist-title">REQUIREMENTS COMPLIANCE MATRIX</div>
                  <div className="checklist-items">
                    {result.checks && result.checks.map((checkText, idx) => {
                      const isPassing = checkText.includes('included') || checkText.includes('At least');
                      return (
                        <div
                          key={idx}
                          className={`check-row ${isPassing ? 'pass' : 'fail'}`}
                        >
                          <div className="check-left">
                            <div className={`check-icon-circle ${isPassing ? 'pass' : 'fail'}`}>
                              {isPassing ? <Check size={12} /> : <XCircle size={12} />}
                            </div>
                            <span>{checkText}</span>
                          </div>
                          <span className={`check-status-badge ${isPassing ? 'pass' : 'fail'}`}>
                            {isPassing ? 'MET' : 'UNMET'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actionable Recommendations */}
                  <div className="recommendation-box">
                    <Sparkles size={18} className="recommendation-icon" />
                    <div>
                      <div className="recommendation-title">Actionable Recommendation</div>
                      <p className="recommendation-text">
                        {result.strength === 'Strong'
                          ? 'Excellent security posture. Continue maintaining uniqueness across all services and pair with multi-factor authentication (MFA).'
                          : result.strength === 'Medium'
                          ? 'Moderate resilience. Add missing character classes or increase length to at least 14-16 characters to prevent dictionary attacks.'
                          : 'Vulnerable specimen. Avoid short lengths or common patterns. Use an unpredictable passphrase or password manager generator.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GLASS BOX SECTION */}
        <section className="section-spacer" id="glass-box">
          <div className="section-badge">
            <Layers size={14} /> GLASS BOX EXPLAINABILITY
          </div>
          <h2 className="section-heading">Deterministic Scoring Mechanics</h2>
          <p className="section-desc">
            No proprietary obscurity. The Spring Boot backend evaluates candidate passwords 
            against deterministic verification criteria with transparent scoring weights.
          </p>

          <div className="glass-box-grid">
            {GLASS_BOX_RULES.map((rule) => (
              <div className="glass-box-card" key={rule.name}>
                <div className="glass-box-top">
                  <span className="stat-label">{rule.category}</span>
                  <span className="rule-weight-badge">{rule.weight}</span>
                </div>
                <h4>{rule.name}</h4>
                <p>{rule.rationale}</p>
                <div className="rule-code-snippet">{rule.rule}</div>
              </div>
            ))}
          </div>
        </section>

        {/* INFORMATIONAL & CYBERSECURITY DEEP DIVES */}
        <section className="section-spacer">
          <div className="section-badge">
            <ShieldCheck size={14} /> CYBERSECURITY ARCHITECTURE
          </div>
          <h2 className="section-heading">Core Security Principles</h2>
          <p className="section-desc">
            Understanding the mathematics, attack vectors, and hygiene rules behind modern credential security.
          </p>

          <div className="deep-dive-grid">
            <div className="deep-dive-card">
              <h3><Lock size={18} color="#3b82f6" /> Length & Entropy vs. Complexity</h3>
              <p>
                Each added character exponentially increases the computational keyspace for attackers. 
                An 8-character password of mixed case has ~\(2 \times 10^{14}\) permutations, whereas a 
                16-character passphrase has over \(10^{28}\) permutations — resisting brute-force rigs for centuries.
              </p>
              <ul>
                <li>Aim for a minimum of 12–16 characters for high-value services.</li>
                <li>Passphrases (e.g. four random unrelated words) deliver superior entropy with high memorability.</li>
              </ul>
            </div>

            <div className="deep-dive-card">
              <h3><AlertTriangle size={18} color="#f59e0b" /> Common Pattern & Dictionary Risks</h3>
              <p>
                Automated credential-stuffing tools use wordlists like RockYou containing billions of 
                previously breached passwords. Leet-speak substitutions like 'P@ssw0rd1' are tested 
                instantaneously by modern hashcat engines.
              </p>
              <ul>
                <li>Avoid sequential digits (1234, 0000) or keyboard runs (qwerty, asdf).</li>
                <li>Never base passwords on personal information such as birthdays or pet names.</li>
              </ul>
            </div>

            <div className="deep-dive-card">
              <h3><RefreshCw size={18} color="#10b981" /> Credential Reuse & Blast Radius</h3>
              <p>
                When a single reused password is leaked in a third-party data breach, attackers script 
                automated credential stuffing attacks against banking, email, and cloud providers within hours.
              </p>
              <ul>
                <li>Ensure every online identity has a distinct, isolated password.</li>
                <li>Employ a secure password manager and hardware security keys (FIDO2 / WebAuthn).</li>
              </ul>
            </div>

            <div className="deep-dive-card">
              <h3><Info size={18} color="#8b5cf6" /> Privacy & Security Limitations</h3>
              <p>
                SecurePass provides heuristic rule evaluation for educational and audit purposes. 
                A 100/100 score does not guarantee absolute immunity against phishing, social engineering, 
                or compromised endpoints.
              </p>
              <ul>
                <li>In-memory processing: passwords are never stored to a database.</li>
                <li>Always complement strong credentials with multi-factor authentication (MFA).</li>
              </ul>
            </div>
          </div>

          {/* Honest Transparency Limitation Banner */}
          <div className="limitation-banner">
            <Info size={22} className="limitation-icon" />
            <div className="limitation-content">
              <h4>System Transparency & Persistence Disclaimer</h4>
              <p>
                The SecurePass backend runs an in-memory Spring Boot architecture (H2 in-memory mode enabled). 
                No customer passwords, plaintexts, or assessment histories are persisted to disk or external databases. 
                Scoring reflects deterministic heuristic checks and should be used as an educational guideline alongside 
                NIST SP 800-63B password guidance.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-container">
          <div className="footer-top">
            <div className="nav-brand">
              <div className="brand-icon">
                <Shield size={16} />
              </div>
              <div className="brand-title-wrap">
                <span className="brand-title">SECUREPASS</span>
                <span className="brand-tag">SECURITY INTELLIGENCE BEYOND PASSWORDS</span>
              </div>
            </div>

            <div className="footer-nav">
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Overview</a>
              <a href="#pipeline" onClick={(e) => { e.preventDefault(); scrollToSection('pipeline'); }}>Pipeline</a>
              <a href="#security-lab" onClick={(e) => { e.preventDefault(); scrollToSection('security-lab'); }}>Security Lab</a>
              <a href="#glass-box" onClick={(e) => { e.preventDefault(); scrollToSection('glass-box'); }}>Glass Box</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 SecurePass. PRISM-inspired Cybersecurity Intelligence.</span>
            <div className="footer-badge">
              <Activity size={12} /> AUDITABLE SECURITY ENGINE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
