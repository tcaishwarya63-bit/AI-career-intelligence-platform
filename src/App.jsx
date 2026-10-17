import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  GraduationCap, 
  Compass, 
  Briefcase, 
  Layers, 
  LogOut, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Award, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  Key, 
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from './supabase'
import './App.css'

export default function App() {
  // Authentication State
  const [session, setSession] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  
  // Form Inputs
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Aptitude Quiz State
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(null)

  // Listen for Supabase Authentication state changes
  useEffect(() => {
    // Check initial session
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  // Handle User Registration
  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!email || !password) {
      setAuthError('Please fill in both email and password.')
      return
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.')
      return
    }

    if (!isSupabaseConfigured) {
      // Demo fallback when keys are not configured
      setSession({
        user: {
          id: 'demo-user-123',
          email: email,
          user_metadata: { full_name: fullName || 'Career Explorer' }
        }
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || 'Student'
          }
        }
      })

      if (error) throw error

      if (data?.user && data.session) {
        setAuthSuccess('Account created and logged in successfully!')
        setSession(data.session)
      } else {
        setAuthSuccess('Registration successful! Please check your email to confirm your account, or sign in.')
      }
    } catch (err) {
      setAuthError(err.message || 'Error creating account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle User Login
  const handleSignIn = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!email || !password) {
      setAuthError('Please provide both email and password.')
      return
    }

    if (!isSupabaseConfigured) {
      // Demo fallback
      setSession({
        user: {
          id: 'demo-user-123',
          email: email,
          user_metadata: { full_name: fullName || 'Career Explorer' }
        }
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      setSession(data.session)
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials or user not found.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Logout
  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setSession(null)
    setFullName('')
    setEmail('')
    setPassword('')
    setAuthSuccess('')
    setAuthError('')
  }

  // Demo Sign-in for immediate hackathon testing
  const handleDemoLogin = () => {
    setSession({
      user: {
        id: 'sih-demo-user',
        email: 'student.sih2025@careerintel.ai',
        user_metadata: { full_name: 'Aditya Sharma' }
      }
    })
  }

  // Interactive Quiz handler
  const handleQuizSubmit = (selectedOption) => {
    setQuizAnswer(selectedOption)
    setQuizScore(92)
  }

  // Recommended careers data
  const careers = [
    {
      id: 1,
      title: 'AI & Machine Learning Engineer',
      match: '98% Match',
      desc: 'Build intelligent neural models, fine-tune LLMs, and develop computer vision pipelines.',
      skills: ['Python', 'PyTorch', 'Transformers', 'Math & Statistics', 'MLOps'],
      demand: 'High Demand • ₹12-28 LPA'
    },
    {
      id: 2,
      title: 'Cloud Solutions Architect',
      match: '91% Match',
      desc: 'Architect scalable, fault-tolerant infrastructure and cloud ecosystems on AWS/GCP.',
      skills: ['Kubernetes', 'Docker', 'Terraform', 'System Design', 'Cloud Security'],
      demand: 'Very High • ₹15-32 LPA'
    },
    {
      id: 3,
      title: 'Data & Intelligence Strategist',
      match: '86% Match',
      desc: 'Transform raw enterprise telemetry into actionable predictive insights and AI dashboards.',
      skills: ['SQL', 'Data Pipelines', 'PowerBI', 'Predictive Modeling'],
      demand: 'Growing • ₹10-22 LPA'
    }
  ]

  // College & opportunity finder data
  const colleges = [
    {
      name: 'Indian Institute of Technology (IIT) Delhi',
      program: 'M.Tech in Machine Intelligence and Data Science (MINDS)',
      location: 'New Delhi, India',
      rating: '4.9 ★',
      nirf: 'NIRF Rank #2'
    },
    {
      name: 'IIIT Hyderabad',
      program: 'Kohli Center on Intelligent Systems (KCIS) AI Specialization',
      location: 'Hyderabad, India',
      rating: '4.8 ★',
      nirf: 'Top AI Research Lab'
    },
    {
      name: 'BITS Pilani',
      program: 'B.E. Computer Science with AI & Deep Learning Minor',
      location: 'Pilani & Goa, India',
      rating: '4.7 ★',
      nirf: 'Top Tier Institute'
    }
  ]

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <div className="brand-text">
            <h1>CareerIntel AI</h1>
            <span className="brand-badge">SIH 2025 Edition</span>
          </div>
        </div>

        {session && (
          <div className="nav-actions">
            <div className="user-profile-badge">
              <div className="avatar-dot">
                {(session.user?.user_metadata?.full_name || session.user?.email || 'U')[0].toUpperCase()}
              </div>
              <span>{session.user?.user_metadata?.full_name || session.user?.email}</span>
            </div>
            <button className="btn-secondary" onClick={handleSignOut} title="Sign Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Supabase Status Banner */}
      <div className={`config-banner ${isSupabaseConfigured ? 'configured' : ''}`}>
        <div className="config-banner-content">
          <Key size={14} />
          <span>
            {isSupabaseConfigured 
              ? 'Connected to live Supabase Backend: Authentication & Tables Active'
              : 'Development Mode: Using local fallback. Add your Supabase keys in .env to sync with your cloud dashboard.'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {!session ? (
        /* ================= AUTHENTICATION VIEW ================= */
        <main className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isRegistering ? 'Create Your Account' : 'Welcome Back'}</h2>
              <p>
                {isRegistering 
                  ? 'Join the AI Career Intelligence Platform to explore your future' 
                  : 'Access your personalized career dashboard & roadmaps'}
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="auth-tabs">
              <button 
                type="button"
                className={`auth-tab ${!isRegistering ? 'active' : ''}`}
                onClick={() => { setIsRegistering(false); setAuthError(''); setAuthSuccess('') }}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-tab ${isRegistering ? 'active' : ''}`}
                onClick={() => { setIsRegistering(true); setAuthError(''); setAuthSuccess('') }}
              >
                Register
              </button>
            </div>

            {/* Alert messages */}
            {authError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={isRegistering ? handleSignUp : handleSignIn}>
              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input 
                      id="fullName"
                      type="text" 
                      placeholder="e.g. Aditya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input 
                    id="email"
                    type="email" 
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input 
                    id="password"
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="spin" size={16} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <button type="button" className="btn-demo" onClick={handleDemoLogin}>
              ⚡ Quick Preview: Explore Dashboard in 1-Click
            </button>
          </div>
        </main>
      ) : (
        /* ================= LOGGED IN DASHBOARD VIEW ================= */
        <main className="dashboard-wrapper">
          {/* Hero Welcome */}
          <div className="dashboard-hero">
            <div>
              <h2>Hello, {session.user?.user_metadata?.full_name || 'Career Explorer'}! 👋</h2>
              <p>Welcome to your AI Career Intelligence Command Center. Here is your roadmap and progress.</p>
            </div>
            <div className="stat-pills">
              <div className="stat-pill">
                <div className="stat-pill-val">98%</div>
                <div className="stat-pill-lbl">AI Profile Fit</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val">12</div>
                <div className="stat-pill-lbl">Skills Identified</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val">Top 5%</div>
                <div className="stat-pill-lbl">Aptitude Score</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="dash-tabs">
            <button 
              className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Compass size={18} />
              <span>AI Recommendations</span>
            </button>
            <button 
              className={`dash-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <Layers size={18} />
              <span>Career Tree & Roadmap</span>
            </button>
            <button 
              className={`dash-tab ${activeTab === 'assessment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessment')}
            >
              <Award size={18} />
              <span>Aptitude Assessment</span>
            </button>
            <button 
              className={`dash-tab ${activeTab === 'colleges' ? 'active' : ''}`}
              onClick={() => setActiveTab('colleges')}
            >
              <GraduationCap size={18} />
              <span>College & Search Finder</span>
            </button>
          </div>

          {/* TAB 1: AI Career Recommendations */}
          {activeTab === 'overview' && (
            <div>
              <div className="cards-grid">
                {careers.map((career) => (
                  <div key={career.id} className="feature-card">
                    <div>
                      <div className="card-top">
                        <div className="card-icon">
                          <Briefcase size={22} />
                        </div>
                        <span className="match-badge">{career.match}</span>
                      </div>
                      <h3>{career.title}</h3>
                      <p>{career.desc}</p>
                      <div className="tag-list">
                        {career.skills.map((skill, index) => (
                          <span key={index} className="tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{career.demand}</span>
                      <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                        View Path →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Career Roadmap Tree */}
          {activeTab === 'roadmap' && (
            <div className="roadmap-container">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={22} color="var(--primary)" />
                <span>Personalized Career Tree: AI & Systems Track</span>
              </h3>

              <div className="roadmap-step">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Foundational Mathematics & Algorithmic Thinking</h4>
                  <p>Master Linear Algebra, Probability, Statistics, and Data Structures in Python.</p>
                  <div className="tag-list">
                    <span className="tag">Khan Academy Linear Algebra</span>
                    <span className="tag">LeetCode Core 75</span>
                  </div>
                </div>
              </div>

              <div className="roadmap-step">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Deep Learning & Neural Architectures</h4>
                  <p>Implement Convolutional Networks, Recurrent Units, and Modern Attention Transformers.</p>
                  <div className="tag-list">
                    <span className="tag">CS231n Computer Vision</span>
                    <span className="tag">HuggingFace NLP Course</span>
                  </div>
                </div>
              </div>

              <div className="roadmap-step">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>AI Production & Cloud Deployment</h4>
                  <p>Package models with FastAPI & Docker, deploy onto Kubernetes and monitor inference drift.</p>
                  <div className="tag-list">
                    <span className="tag">Docker & Kubernetes</span>
                    <span className="tag">Triton Inference Server</span>
                  </div>
                </div>
              </div>

              <div className="roadmap-step">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Industry Capstone & Smart India Hackathon Prototype</h4>
                  <p>Deploy real-time solutions for education, healthcare, or smart mobility.</p>
                  <div className="tag-list">
                    <span className="tag">SIH 2025 Prototype</span>
                    <span className="tag">GitHub Open Source</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Aptitude Assessment */}
          {activeTab === 'assessment' && (
            <div className="feature-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
              <h3>🧠 Smart Aptitude & Career Orientation Test</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Answer this diagnostic problem to calibrate your AI Career Recommendation index:
              </p>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '10px', margin: '1.5rem 0' }}>
                <p style={{ fontWeight: 600, color: '#f3f4f6', marginBottom: '1rem' }}>
                  Question: When you encounter an ambiguous system problem, what energizes you the most?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Analyzing the underlying mathematical patterns and statistical data distributions',
                    'Designing intuitive user experiences and real-time interactive interfaces',
                    'Configuring distributed cloud clusters, networks, and low-latency APIs',
                    'Leading product vision and translating customer problems into business solutions'
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      className={`btn-secondary ${quizAnswer === idx ? 'active-option' : ''}`}
                      style={{ 
                        justifyContent: 'flex-start', 
                        textAlign: 'left',
                        borderColor: quizAnswer === idx ? 'var(--primary)' : 'var(--border)',
                        background: quizAnswer === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(31, 41, 55, 0.7)'
                      }}
                      onClick={() => handleQuizSubmit(idx)}
                    >
                      <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {quizScore && (
                <div className="alert alert-success">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>Aptitude Analysis Complete!</strong>
                    <p style={{ marginTop: '0.2rem', fontSize: '0.82rem' }}>
                      Your answers indicate a strong aptitude for <strong>Analytical Machine Intelligence & Systems Engineering</strong>. Match score calibrated to 98%.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: College & Opportunity Finder */}
          {activeTab === 'colleges' && (
            <div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
                <div className="input-with-icon" style={{ flex: 1 }}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by institute, program, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="cards-grid">
                {filteredColleges.map((college, idx) => (
                  <div key={idx} className="feature-card">
                    <div>
                      <div className="card-top">
                        <GraduationCap size={24} color="#60a5fa" />
                        <span className="match-badge">{college.rating}</span>
                      </div>
                      <h3>{college.name}</h3>
                      <p style={{ fontWeight: 500, color: '#93c5fd', marginTop: '0.25rem' }}>{college.program}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {college.location}</p>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>{college.nirf}</span>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>AI-Powered Career Intelligence Platform • Smart India Hackathon (SIH) 2025 Assignment</p>
      </footer>
    </div>
  )
}
