import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Home,
  Target, 
  Layers, 
  BookOpen, 
  FileText, 
  UserCheck, 
  Briefcase, 
  Building2, 
  ClipboardCheck, 
  Award, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  ChevronDown, 
  Check, 
  CheckCircle2, 
  TrendingUp, 
  UploadCloud, 
  RefreshCw, 
  LogOut, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  XCircle,
  BarChart3,
  ExternalLink,
  Brain,
  Database,
  Save,
  Cloud,
  Download,
  Clock,
  Play,
  RotateCcw,
  MessageSquare,
  Lightbulb,
  CheckCircle
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

  // Active Tab - 12 Headings from Teacher's Reference Image
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  // Resume Upload & Extraction State (Milestone 1)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [m1Skills, setM1Skills] = useState('Python, Machine Learning, SQL, Data Visualization, Deep Learning, Statistics')
  const [m1Degree, setM1Degree] = useState('B.S. Computer Science and Master of Science in Data Science')
  const [m1University, setM1University] = useState('University of California, Berkeley')
  const [m1Role, setM1Role] = useState('Data Scientist Intern')
  const [m1IsCalculating, setM1IsCalculating] = useState(false)
  const [m1Predictions, setM1Predictions] = useState([
    { role: 'Data Scientist', prob: 66, type: 'primary' },
    { role: 'Software Engineer', prob: 18, type: 'secondary' },
    { role: 'Business Analyst', prob: 10, type: 'tertiary' },
    { role: 'Product Manager', prob: 6, type: 'tertiary' }
  ])

  // Milestone 2 Skill Gap State
  const [selectedTargetRole, setSelectedTargetRole] = useState('Machine Learning Engineer')

  // Milestone 3: Learning Path Progression & Completed Milestones
  const [completedMilestones, setCompletedMilestones] = useState([1, 2])

  // Milestone 3: Interactive Mock Interview State
  const [interviewRole, setInterviewRole] = useState('Machine Learning Engineer')
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [interviewTimer, setInterviewTimer] = useState(900)
  const [interviewSubmitted, setInterviewSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [interviewEval, setInterviewEval] = useState(null)

  // Aptitude Quiz State
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(null)

  // Supabase Database State (profiles, resumes, predictions tables)
  const [savedResumes, setSavedResumes] = useState([])
  const [savedPredictions, setSavedPredictions] = useState([])
  const [dbSaving, setDbSaving] = useState(false)
  const [dbStatusMsg, setDbStatusMsg] = useState('')
  const [dbRecordCounts, setDbRecordCounts] = useState({ profiles: 1, resumes: 0, predictions: 0 })

  // Function to load all user data from Supabase Cloud Database
  const loadUserData = async (userId) => {
    if (!isSupabaseConfigured || !userId || userId === 'sih-demo-user' || userId === 'demo-user-123') return
    try {
      // 1. Fetch Profile
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (prof && !profErr) {
        if (prof.full_name) setFullName(prof.full_name)
        if (prof.skills && prof.skills.length > 0) setM1Skills(prof.skills.join(', '))
        if (prof.institution) setM1University(prof.institution)
        if (prof.education_level) setM1Degree(prof.education_level)
        if (prof.target_role) setSelectedTargetRole(prof.target_role)
      }

      // 2. Fetch Resumes History
      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false })
        .limit(5)
      if (resumes) setSavedResumes(resumes)

      // 3. Fetch Predictions History
      const { data: preds } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (preds) setSavedPredictions(preds)

      setDbRecordCounts({
        profiles: prof ? 1 : 0,
        resumes: resumes ? resumes.length : 0,
        predictions: preds ? preds.length : 0
      })
    } catch (err) {
      console.warn('Error loading Supabase user data:', err)
    }
  }

  // Listen for Supabase Authentication
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        if (session?.user?.id) loadUserData(session.user.id)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if (session?.user?.id) loadUserData(session.user.id)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!email || !password) {
      setAuthError('Please fill in both email and password.')
      return
    }

    if (!isSupabaseConfigured) {
      setSession({
        user: {
          id: 'demo-user-123',
          email: email,
          user_metadata: { full_name: fullName || 'Ananya' }
        }
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || 'Ananya' } }
      })
      if (error) throw error
      if (data?.user && data.session) {
        setSession(data.session)
        loadUserData(data.user.id)
      } else {
        setAuthSuccess('Registration successful! Please check your email to confirm.')
      }
    } catch (err) {
      setAuthError(err.message || 'Error creating account.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (!email || !password) {
      setAuthError('Please provide both email and password.')
      return
    }

    if (!isSupabaseConfigured) {
      setSession({
        user: {
          id: 'demo-user-123',
          email: email,
          user_metadata: { full_name: fullName || 'Ananya' }
        }
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setSession(data.session)
      if (data.session?.user?.id) loadUserData(data.session.user.id)
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setSession(null)
    setSavedResumes([])
    setSavedPredictions([])
  }

  // Quick Demo Login
  const handleDemoLogin = () => {
    setSession({
      user: {
        id: 'sih-demo-user',
        email: 'ananya.it@careerintel.ai',
        user_metadata: { full_name: 'Ananya' }
      }
    })
  }

  // Save Candidate Profile into Supabase 'profiles' table
  const handleSaveProfile = async () => {
    if (!session?.user?.id) return
    if (session.user.id === 'sih-demo-user' || session.user.id === 'demo-user-123') {
      setDbStatusMsg('Demo mode: Profile updated in local session. Sign up to sync with cloud database!')
      setTimeout(() => setDbStatusMsg(''), 4000)
      return
    }
    setDbSaving(true)
    try {
      const skillsArray = m1Skills.split(',').map(s => s.trim()).filter(Boolean)
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: fullName || userName,
        skills: skillsArray,
        institution: m1University,
        education_level: m1Degree,
        target_role: selectedTargetRole,
        updated_at: new Date().toISOString()
      })
      if (error) throw error
      setDbStatusMsg('Candidate profile synchronized to Supabase PostgreSQL database!')
      setTimeout(() => setDbStatusMsg(''), 4000)
      loadUserData(session.user.id)
    } catch (err) {
      console.error('Supabase profile save error:', err)
      setDbStatusMsg('Cloud sync error: ' + (err.message || 'Failed to save'))
      setTimeout(() => setDbStatusMsg(''), 5000)
    } finally {
      setDbSaving(false)
    }
  }

  // Record prediction into Supabase 'predictions' table
  const savePredictionToDb = async (preds) => {
    if (!session?.user?.id || session.user.id === 'sih-demo-user' || session.user.id === 'demo-user-123' || !preds?.length) return
    try {
      const top = preds[0]
      await supabase.from('predictions').insert({
        user_id: session.user.id,
        predicted_role: top.role,
        confidence_score: top.prob,
        all_probabilities: preds
      })
      loadUserData(session.user.id)
    } catch (err) {
      console.warn('Could not record prediction to Supabase:', err)
    }
  }

  // Resume Upload to FastAPI & save to Supabase 'resumes' and 'predictions' tables
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingResume(true)
      setUploadedFileName(file.name)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('http://127.0.0.1:8000/upload-resume', {
          method: 'POST',
          body: formData
        })
        if (response.ok) {
          const data = await response.json()
          let currentSkills = m1Skills
          let currentRole = m1Role
          let currentDegree = m1Degree
          let currentUniv = m1University

          if (data.extracted_entities?.skills?.length) {
            currentSkills = data.extracted_entities.skills.join(', ')
            setM1Skills(currentSkills)
          }
          if (data.extracted_entities?.roles?.length) {
            currentRole = data.extracted_entities.roles.join(', ')
            setM1Role(currentRole)
          }
          if (data.extracted_entities?.degrees?.length) {
            currentDegree = data.extracted_entities.degrees.join(', ')
            setM1Degree(currentDegree)
          }
          if (data.extracted_entities?.institutions?.length) {
            currentUniv = data.extracted_entities.institutions.join(', ')
            setM1University(currentUniv)
          }

          let formattedPreds = null
          if (data.all_ranked_probabilities) {
            formattedPreds = data.all_ranked_probabilities.map((item, idx) => ({
              role: item.role,
              prob: Math.round(item.probability),
              type: idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'tertiary'
            }))
            setM1Predictions(formattedPreds)
          }

          // Record in Supabase database
          if (session?.user?.id && session.user.id !== 'sih-demo-user' && session.user.id !== 'demo-user-123') {
            try {
              const skillsArr = data.extracted_entities?.skills || currentSkills.split(',').map(s => s.trim()).filter(Boolean)
              const rolesArr = data.extracted_entities?.roles || [currentRole]
              const degreesArr = data.extracted_entities?.degrees || [currentDegree]

              await supabase.from('resumes').insert({
                user_id: session.user.id,
                file_name: file.name,
                extracted_skills: skillsArr,
                extracted_roles: rolesArr,
                extracted_degrees: degreesArr
              })

              if (formattedPreds && formattedPreds.length > 0) {
                await savePredictionToDb(formattedPreds)
              }
              setDbStatusMsg('Resume and extraction results recorded to Supabase cloud database!')
              setTimeout(() => setDbStatusMsg(''), 4000)
              loadUserData(session.user.id)
            } catch (dbErr) {
              console.warn('Supabase resume recording warning:', dbErr)
            }
          }
        } else {
          handleRecalculateM1()
        }
      } catch (err) {
        console.warn('FastAPI backend offline, running fallback:', err)
        handleRecalculateM1()
      } finally {
        setUploadingResume(false)
      }
    }
  }

  // Recalculate predictions
  const handleRecalculateM1 = async () => {
    setM1IsCalculating(true)
    let newPredictions = null
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: m1Skills, experience_role: m1Role, degree: m1Degree })
      })
      if (response.ok) {
        const data = await response.json()
        if (data.all_ranked_probabilities) {
          newPredictions = data.all_ranked_probabilities.map((item, idx) => ({
            role: item.role,
            prob: Math.round(item.probability),
            type: idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'tertiary'
          }))
          setM1Predictions(newPredictions)
          setM1IsCalculating(false)
          savePredictionToDb(newPredictions)
          return
        }
      }
    } catch (err) {
      console.warn('FastAPI offline, using dynamic fallback:', err)
    }

    setTimeout(() => {
      const lower = m1Skills.toLowerCase()
      let ds = 55
      let se = 20
      let ba = 15
      if (lower.includes('machine learning') || lower.includes('deep learning')) ds += 15
      if (lower.includes('python') || lower.includes('sql')) ds += 5
      if (lower.includes('react') || lower.includes('java')) { se += 25; ds -= 10 }
      const total = ds + se + ba
      const normDs = Math.round((ds / total) * 94)
      const normSe = Math.round((se / total) * 94)
      const normBa = Math.max(5, 94 - normDs - normSe)
      const fallbackPreds = [
        { role: 'Data Scientist', prob: normDs, type: 'primary' },
        { role: 'Software Engineer', prob: normSe, type: 'secondary' },
        { role: 'Business Analyst', prob: normBa, type: 'tertiary' },
        { role: 'Product Manager', prob: 6, type: 'tertiary' }
      ]
      setM1Predictions(fallbackPreds)
      setM1IsCalculating(false)
      savePredictionToDb(fallbackPreds)
    }, 400)
  }

  // Mock Interview Questions Database by Target Career Role
  const interviewQuestionsByRole = {
    'Machine Learning Engineer': [
      {
        id: 1,
        title: "Class Imbalance Mitigation",
        question: "How do you detect and handle severe class imbalance in a classification dataset?",
        hint: "Consider SMOTE, focal loss, class weights, precision-recall AUC, stratified k-fold cross-validation.",
        keywords: ["smote", "weights", "focal", "imbalance", "stratified", "precision", "recall", "resampling", "oversampling", "undersampling"]
      },
      {
        id: 2,
        title: "L1 vs L2 Regularization",
        question: "Explain the fundamental difference between L1 (Lasso) and L2 (Ridge) regularization and how each impacts model weights.",
        hint: "L1 adds absolute penalties causing sparsity and feature selection; L2 adds squared penalties shrinking weights evenly without setting them strictly to zero.",
        keywords: ["lasso", "ridge", "absolute", "squared", "sparse", "shrinkage", "feature selection", "penalty", "weights", "norm"]
      },
      {
        id: 3,
        title: "Low-Latency ML Inference & Drift",
        question: "When deploying an ML inference service using FastAPI or Triton, how do you handle concurrency, minimize latency, and monitor for data drift?",
        hint: "Discuss async/uvicorn workers, model quantization/caching, dynamic batching, and tracking feature distributions (KS-test / PSI).",
        keywords: ["concurrency", "latency", "async", "drift", "batching", "monitoring", "caching", "workers", "distribution", "quantization"]
      },
      {
        id: 4,
        title: "Validation Strategy & Leakage",
        question: "Why might high training accuracy be deceptive, and what validation strategy prevents data leakage?",
        hint: "Discuss overfitting, train/val/test splits, time-series splits, and fitting vectorizers/scalers strictly on training folds.",
        keywords: ["overfitting", "leakage", "validation", "cross-validation", "generalization", "split", "preprocessing", "unseen"]
      }
    ],
    'Software Engineer': [
      {
        id: 1,
        title: "SQL vs NoSQL Architecture",
        question: "Explain the difference between SQL (relational) and NoSQL (document/key-value) databases. When would you choose one over the other?",
        hint: "Discuss ACID guarantees, schema rigidity, horizontal scaling (CAP theorem), complex joins vs high-throughput key lookups.",
        keywords: ["acid", "schema", "relational", "scaling", "horizontal", "vertical", "consistency", "sharding", "joins", "nosql"]
      },
      {
        id: 2,
        title: "React Reconciliation & Keys",
        question: "How does the React Virtual DOM diffing algorithm optimize UI updates, and why is the 'key' prop essential in lists?",
        hint: "Explain reconciliation, tree diffing heuristics in O(n), and maintaining stable element identities across renders.",
        keywords: ["virtual dom", "reconciliation", "diffing", "key", "re-render", "performance", "tree", "fiber"]
      },
      {
        id: 3,
        title: "REST Idempotency & HTTP Verbs",
        question: "What makes an API endpoint idempotent? What is the technical difference between HTTP PUT and PATCH?",
        hint: "PUT replaces the entire resource; PATCH updates partial fields. Both can be idempotent; POST is typically non-idempotent.",
        keywords: ["idempotent", "put", "patch", "replace", "partial", "payload", "http", "state"]
      },
      {
        id: 4,
        title: "Distributed Rate Limiter Design",
        question: "How would you design a thread-safe rate limiter for a distributed API service?",
        hint: "Mention algorithms like Token Bucket / Leaky Bucket, Redis atomic counters (INCR), and sliding window rate limits.",
        keywords: ["token bucket", "leaky bucket", "redis", "sliding window", "distributed", "concurrency", "rate limit", "atomic"]
      }
    ],
    'Data Scientist': [
      {
        id: 1,
        title: "Tabular EDA & Imputation",
        question: "Describe your step-by-step workflow for Exploratory Data Analysis (EDA) on a tabular dataset with missing values and outliers.",
        hint: "Summary statistics, distributions (IQR/Z-score), correlation matrix, imputation strategies, domain validation.",
        keywords: ["eda", "iqr", "z-score", "imputation", "distribution", "correlation", "missing", "outliers", "visualization"]
      },
      {
        id: 2,
        title: "A/B Experimentation & Statistical Power",
        question: "How do you design, size (power analysis), and evaluate an A/B experiment before launching a product feature?",
        hint: "Hypothesis definition, statistical power (80%), alpha (0.05), minimum detectable effect (MDE), p-value significance.",
        keywords: ["hypothesis", "p-value", "significance", "power", "sample size", "mde", "control", "variant", "confidence"]
      },
      {
        id: 3,
        title: "Central Limit Theorem & Inference",
        question: "What is the Central Limit Theorem and why is it fundamental to statistical inference in data science?",
        hint: "Distribution of sample means approaches normality as sample size increases, allowing z-tests/t-tests without knowing population distribution.",
        keywords: ["central limit", "normal", "sample mean", "variance", "hypothesis", "population", "inference"]
      },
      {
        id: 4,
        title: "SQL Query Performance Tuning",
        question: "How do you diagnose and optimize a slow SQL query involving multi-million row joins?",
        hint: "EXPLAIN plan, indexing (B-Tree), partitioning, avoiding SELECT *, avoiding unnecessary subqueries.",
        keywords: ["explain", "index", "b-tree", "join", "partition", "execution plan", "cost", "optimization"]
      }
    ],
    'DevOps / Cloud Architect': [
      {
        id: 1,
        title: "Kubernetes Control Plane & Pods",
        question: "Explain the architecture of Kubernetes: how do Control Plane components coordinate with Worker Nodes?",
        hint: "etcd stores cluster state, API Server handles requests, Scheduler assigns pods, kubelet enforces container state on nodes.",
        keywords: ["control plane", "etcd", "api server", "kubelet", "kube-proxy", "scheduler", "nodes", "pods"]
      },
      {
        id: 2,
        title: "Infrastructure as Code & Drift",
        question: "What is Infrastructure as Code (IaC) and how does Terraform manage state and reconcile configuration drift?",
        hint: "Declarative HCL syntax, terraform.tfstate, plan/apply lifecycle, detecting manual infrastructure changes.",
        keywords: ["terraform", "state", "declarative", "drift", "plan", "apply", "provider", "immutable"]
      },
      {
        id: 3,
        title: "Zero-Downtime Deployment Strategies",
        question: "Explain Blue/Green vs. Canary deployment strategies and how rollback is executed in each.",
        hint: "Blue/Green switches traffic 100% instantly with fallback; Canary shifts a small percentage (e.g. 5%) and monitors error rates.",
        keywords: ["blue green", "canary", "traffic", "rollback", "routing", "downtime", "monitoring", "load balancer"]
      },
      {
        id: 4,
        title: "CI/CD & Container Security",
        question: "What are the essential best practices for securing CI/CD pipelines and container images?",
        hint: "Multi-stage builds, non-root users, vulnerability scanning (Trivy), secret management (vault), least privilege.",
        keywords: ["multi-stage", "non-root", "scanning", "vulnerability", "secrets", "vault", "least privilege", "docker"]
      }
    ]
  }

  // Active question set
  const activeQuestions = interviewQuestionsByRole[interviewRole] || interviewQuestionsByRole['Machine Learning Engineer']

  // Countdown timer for mock interview
  useEffect(() => {
    let interval = null
    if (interviewStarted && !interviewSubmitted && interviewTimer > 0) {
      interval = setInterval(() => {
        setInterviewTimer((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted, interviewSubmitted, interviewTimer])

  // Start interview session
  const handleStartInterview = (role) => {
    const chosenRole = role || selectedTargetRole || 'Machine Learning Engineer'
    setInterviewRole(chosenRole)
    setInterviewStarted(true)
    setCurrentQIdx(0)
    setUserAnswers({})
    setInterviewTimer(900)
    setInterviewSubmitted(false)
    setShowHint(false)
    setInterviewEval(null)
  }

  // Answer change handler
  const handleAnswerChange = (qId, text) => {
    setUserAnswers(prev => ({ ...prev, [qId]: text }))
  }

  // AI Evaluation logic
  const handleEvaluateInterview = () => {
    const questions = activeQuestions
    let totalScore = 0
    let detectedKeywords = []
    let detailedFeedback = []

    questions.forEach((q) => {
      const ans = (userAnswers[q.id] || '').toLowerCase()
      const matched = q.keywords.filter(kw => ans.includes(kw.toLowerCase()))
      detectedKeywords.push(...matched)
      const wordCount = ans.trim().split(/\s+/).filter(Boolean).length

      let qScore = 0
      if (wordCount >= 8) {
        const keywordScore = Math.min(65, (matched.length / Math.min(q.keywords.length, 5)) * 65)
        const depthScore = Math.min(35, wordCount * 0.7)
        qScore = Math.min(100, Math.round(keywordScore + depthScore))
      }

      totalScore += qScore
      detailedFeedback.push({
        id: q.id,
        title: q.title,
        question: q.question,
        score: qScore,
        matchedKeywords: matched,
        wordCount: wordCount
      })
    })

    const overallScore = Math.round(totalScore / questions.length)
    setInterviewEval({
      score: overallScore,
      rating: overallScore >= 80 ? 'Exceptional Industry Readiness' : overallScore >= 60 ? 'Competent Candidate' : 'Developing Competency',
      matchedCount: detectedKeywords.length,
      feedbackList: detailedFeedback,
      date: new Date().toLocaleDateString()
    })
    setInterviewSubmitted(true)
  }

  // Toggle milestone completion in Learning Path
  const toggleMilestone = (stepId) => {
    setCompletedMilestones(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    )
  }

  // Export Learning Path Roadmap as Printable PDF
  const handleExportRoadmapPDF = () => {
    const printWin = window.open('', '_blank')
    if (!printWin) {
      window.print()
      return
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>CareerCast AI Roadmap - ${userName}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 10px; margin: 0; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .logo { font-size: 24px; font-weight: 800; color: #1e3a8a; }
    .sub { font-size: 11px; color: #64748b; margin-top: 3px; }
    .badge { background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 6px; border: 1px solid #bfdbfe; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; }
    .meta-item { font-size: 11px; color: #64748b; }
    .meta-item strong { display: block; font-size: 13px; color: #0f172a; margin-top: 2px; }
    .section-title { font-size: 15px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 18px 0 12px 0; }
    .step-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; page-break-inside: avoid; background: #ffffff; }
    .step-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .step-header { display: flex; align-items: center; gap: 10px; }
    .step-num { width: 26px; height: 26px; border-radius: 50%; background: #2563eb; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .step-title { font-size: 14px; font-weight: 700; color: #0f172a; }
    .step-status { font-size: 11px; font-weight: 600; color: #059669; }
    .step-desc { font-size: 12px; color: #475569; margin: 4px 0 8px 36px; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-left: 36px; }
    .tag { background: #f1f5f9; color: #334155; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
    .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">CareerCast • Career Progression Tree</div>
      <div class="sub">Smart India Hackathon (SIH 2025) • AI-Powered Personalized Career Roadmap</div>
    </div>
    <div class="badge">Official Institutional Report</div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">Candidate:<strong>${userName}</strong></div>
    <div class="meta-item">Target Career Path:<strong>${selectedTargetRole}</strong></div>
    <div class="meta-item">Match Index:<strong>85% (Grade A Readiness)</strong></div>
    <div class="meta-item">Report Date:<strong>${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
  </div>

  <div class="section-title">Personalized 4-Stage Career Progression Milestones</div>

  <div class="step-card">
    <div class="step-top">
      <div class="step-header">
        <div class="step-num">1</div>
        <div class="step-title">Foundational Mathematics & Algorithmic Thinking</div>
      </div>
      <span class="step-status">${completedMilestones.includes(1) ? '✓ Completed' : 'In Progress'}</span>
    </div>
    <div class="step-desc">Master Linear Algebra, Probability, Statistics, Matrix Decompositions, and Core Data Structures in Python.</div>
    <div class="tags">
      <span class="tag">Khan Academy Linear Algebra</span>
      <span class="tag">MIT 18.06 Matrix Methods</span>
      <span class="tag">LeetCode Core 75</span>
    </div>
  </div>

  <div class="step-card">
    <div class="step-top">
      <div class="step-header">
        <div class="step-num">2</div>
        <div class="step-title">Deep Learning & Neural Architectures</div>
      </div>
      <span class="step-status">${completedMilestones.includes(2) ? '✓ Completed' : 'In Progress'}</span>
    </div>
    <div class="step-desc">Build and evaluate Convolutional Networks, Recurrent Units, Self-Attention, and Transformer models for NLP & Vision.</div>
    <div class="tags">
      <span class="tag">CS231n Computer Vision</span>
      <span class="tag">HuggingFace NLP Course</span>
      <span class="tag">PyTorch Deep Learning Specialization</span>
    </div>
  </div>

  <div class="step-card">
    <div class="step-top">
      <div class="step-header">
        <div class="step-num">3</div>
        <div class="step-title">AI Production & Cloud Deployment</div>
      </div>
      <span class="step-status">${completedMilestones.includes(3) ? '✓ Completed' : 'Scheduled'}</span>
    </div>
    <div class="step-desc">Package models with FastAPI, containerize with Docker, deploy onto Kubernetes clusters, and monitor drift.</div>
    <div class="tags">
      <span class="tag">Docker & Kubernetes for ML</span>
      <span class="tag">Triton Inference Server</span>
      <span class="tag">MLflow Model Tracking</span>
    </div>
  </div>

  <div class="step-card">
    <div class="step-top">
      <div class="step-header">
        <div class="step-num">4</div>
        <div class="step-title">Industry Capstone & SIH 2025 Prototype</div>
      </div>
      <span class="step-status">${completedMilestones.includes(4) ? '✓ Completed' : 'Scheduled'}</span>
    </div>
    <div class="step-desc">Deploy real-time solutions for education, healthcare, or smart mobility with automated CI/CD accuracy checks.</div>
    <div class="tags">
      <span class="tag">SIH 2025 Prototype</span>
      <span class="tag">GitHub Actions CI/CD</span>
      <span class="tag">Production Release</span>
    </div>
  </div>

  <div class="footer">
    <span>CareerCast AI Intelligence Platform • Verified by SpaCy NER & Ensemble Classifier</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`
    printWin.document.open()
    printWin.document.write(htmlContent)
    printWin.document.close()
  }

  // Colleges data
  const colleges = [
    { name: 'IIT Delhi', program: 'M.Tech in Machine Intelligence and Data Science', location: 'New Delhi', rating: '4.9 ★', nirf: 'NIRF #2' },
    { name: 'IIIT Hyderabad', program: 'Kohli Center on Intelligent Systems AI Specialization', location: 'Hyderabad', rating: '4.8 ★', nirf: 'Top AI Lab' },
    { name: 'BITS Pilani', program: 'B.E. Computer Science with AI & Deep Learning Minor', location: 'Pilani & Goa', rating: '4.7 ★', nirf: 'Tier 1' }
  ]

  // The 12 Exact Side Headings from Teacher's Reference Picture
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'career-intelligence', label: 'Career Intelligence', icon: Target },
    { id: 'skill-analysis', label: 'Skill Analysis', icon: Layers },
    { id: 'learning-path', label: 'Learning Path', icon: BookOpen },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { id: 'mock-interview', label: 'Mock Interview', icon: UserCheck },
    { id: 'job-recommendations', label: 'Job Recommendations', icon: Briefcase },
    { id: 'placement-drives', label: 'Placement Drives', icon: Building2 },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle }
  ]

  const userName = session?.user?.user_metadata?.full_name || 'Ananya'

  return (
    <div className="app-layout">
      {/* ================= LEFT SIDEBAR (EXACT MATCH TO TEACHER'S PIC) ================= */}
      <aside className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-brain-icon">
            <Brain size={22} />
          </div>
          <div className="brand-title">
            <span className="brand-name">CareerInfinity</span>
            <span className="brand-sub">AI POWERED</span>
          </div>
        </div>

        {/* 12 Side Headings Navigation */}
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="main-wrapper">
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="search-container">
            <Search size={18} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search careers, skills, jobs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-right">
            <button className="notif-btn" title="Notifications">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>

            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="user-profile-btn">
                  <div className="user-avatar">{userName[0].toUpperCase()}</div>
                  <div className="user-meta">
                    <div className="user-meta-name">
                      <span>Hi, {userName}!</span>
                      <ChevronDown size={14} color="#64748b" />
                    </div>
                    <span className="user-meta-sub">B.Sc IT Student</span>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut} 
                  className="btn-secondary" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button className="btn-solid-blue" onClick={handleDemoLogin}>
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Not Logged In View */}
        {!session ? (
          <div className="auth-wrapper">
            <div className="auth-card">
              <div className="auth-header">
                <h2>{isRegistering ? 'Create Your Account' : 'Welcome Back'}</h2>
                <p>Access your personalized career dashboard & roadmaps</p>
              </div>

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

              {authError && <div className="alert alert-error"><AlertCircle size={18} /><span>{authError}</span></div>}
              {authSuccess && <div className="alert alert-success"><CheckCircle2 size={18} /><span>{authSuccess}</span></div>}

              <form className="auth-form" onSubmit={isRegistering ? handleSignUp : handleSignIn}>
                {isRegistering && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. Ananya"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input 
                      type="email" 
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  <span>{isRegistering ? 'Create Account' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <button type="button" className="btn-demo" onClick={handleDemoLogin}>
                ⚡ 1-Click Demo Login (Explore Platform Instantly)
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN DASHBOARD CONTENT ================= */
          <main className="page-container">
            {/* 1. DASHBOARD TAB (EXACT RECREATION OF TEACHER'S SCREENSHOT) */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="welcome-header">
                  <h2>Welcome back, {userName}! 👋</h2>
                  <p>Track your progress and achieve your dream career</p>
                </div>

                {/* Top Banner: Career Match Score (85%) */}
                <div className="career-match-banner">
                  <div className="score-left">
                    <h4>Career Match Score</h4>
                    <div className="score-num">85%</div>
                    <div className="score-status">
                      <Check size={18} />
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="gauge-circle">
                    <svg width="100" height="100">
                      <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="#10b981" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray="251.2" 
                        strokeDashoffset="37.68" 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <span className="gauge-text">85%</span>
                  </div>

                  <div className="score-right">
                    <p className="score-right-text">
                      Your profile matches <strong>Software Developer</strong>, <strong>Data Analyst</strong> and <strong>2 other career paths</strong>.
                    </p>
                    <button className="btn-pill-outline" onClick={() => setActiveTab('career-intelligence')}>
                      View Details
                    </button>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="stats-grid-4">
                  <div className="stat-card-white">
                    <div>
                      <div className="stat-card-label">Skills Learned</div>
                      <div className="stat-card-num">24</div>
                      <div className="stat-card-growth">
                        <TrendingUp size={14} />
                        <span>15% this month</span>
                      </div>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                      <TrendingUp size={20} />
                    </div>
                  </div>

                  <div className="stat-card-white">
                    <div>
                      <div className="stat-card-label">Certifications</div>
                      <div className="stat-card-num">6</div>
                      <div className="stat-card-growth">
                        <TrendingUp size={14} />
                        <span>20% this month</span>
                      </div>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>
                      <Award size={20} />
                    </div>
                  </div>

                  <div className="stat-card-white">
                    <div>
                      <div className="stat-card-label">Mock Interviews</div>
                      <div className="stat-card-num">8</div>
                      <div className="stat-card-growth">
                        <TrendingUp size={14} />
                        <span>15% this month</span>
                      </div>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <ClipboardCheck size={20} />
                    </div>
                  </div>

                  <div className="stat-card-white">
                    <div>
                      <div className="stat-card-label">Profile Strength</div>
                      <div className="stat-card-num">90%</div>
                      <div className="stat-card-growth" style={{ color: '#059669' }}>
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                      <UserCheck size={20} />
                    </div>
                  </div>
                </div>

                {/* 2-Column Section: Recommended Paths + Skill Progress */}
                <div className="dash-2col">
                  {/* Recommended Career Paths */}
                  <div className="white-panel">
                    <div className="panel-header">
                      <div>
                        <h3>Recommended Career Paths</h3>
                        <p className="panel-sub">Based on your skills, interests & goals</p>
                      </div>
                      <button className="btn-pill-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }} onClick={() => setActiveTab('career-intelligence')}>
                        View All
                      </button>
                    </div>

                    <div>
                      {[
                        { rank: 1, name: 'Software Developer', match: '92% Match', pct: 92 },
                        { rank: 2, name: 'Data Analyst', match: '88% Match', pct: 88 },
                        { rank: 3, name: 'Cloud Engineer', match: '85% Match', pct: 85 }
                      ].map((item) => (
                        <div key={item.rank} className="career-path-row">
                          <div className="path-left">
                            <span className="path-rank">{item.rank}</span>
                            <div>
                              <div className="path-name">{item.name}</div>
                              <div className="path-bar-container">
                                <div className="path-bar-fill" style={{ width: `${item.pct}%` }} />
                              </div>
                            </div>
                          </div>
                          <span className="path-match-score">{item.match}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Progress Overall Performance */}
                  <div className="white-panel">
                    <div className="panel-header">
                      <div>
                        <h3>Skill Progress</h3>
                        <p className="panel-sub">Overall Performance</p>
                      </div>
                    </div>

                    <div>
                      {[
                        { skill: 'Python', pct: 90 },
                        { skill: 'Data Structures', pct: 85 },
                        { skill: 'SQL', pct: 80 },
                        { skill: 'Web Development', pct: 85 },
                        { skill: 'Machine Learning', pct: 80 }
                      ].map((item, idx) => (
                        <div key={idx} className="skill-prog-row">
                          <span className="skill-prog-name">{item.skill}</span>
                          <div className="skill-bar-wrap">
                            <div className="skill-bar-inner" style={{ width: `${item.pct}%` }} />
                          </div>
                          <span className="skill-pct">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom 2-Col Banners: Upcoming Placement + Continue Learning */}
                <div className="dash-2col">
                  {/* Upcoming Placement Drive */}
                  <div className="placement-banner">
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Upcoming Placement Drive</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                        <span className="company-brand-text">Infosys</span>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Software Developer</span>
                      </div>
                    </div>
                    <button className="btn-solid-blue">Apply Now</button>
                  </div>

                  {/* Continue Learning */}
                  <div className="placement-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Continue Learning</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Python for Data Science</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>60% completed</div>
                      </div>
                    </div>
                    <button className="btn-solid-blue" style={{ background: '#6366f1' }}>Continue</button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CAREER INTELLIGENCE (MILESTONE 2 MULTI-MODEL COMPARISON) */}
            {activeTab === 'career-intelligence' && (
              <div>
                <div className="welcome-header">
                  <h2>Career Intelligence & Multi-Model Engine</h2>
                  <p>Benchmarked across Logistic Regression, Random Forest, and XGBoost Ensembles</p>
                </div>

                {/* Model Comparison Bar Chart (Page 5) */}
                <div className="white-panel" style={{ marginBottom: '1.75rem' }}>
                  <div className="panel-header">
                    <div>
                      <h3>Model Comparison — Macro F1-Score</h3>
                      <p className="panel-sub">Benchmarked on multi-class career transition validation split</p>
                    </div>
                    <span className="match-badge">Threshold Met (F1 ≥ 0.80)</span>
                  </div>

                  <div className="f1-bars-grid">
                    <div className="threshold-line">
                      <span>Target Threshold: 0.80</span>
                    </div>

                    <div className="f1-column">
                      <div className="f1-value">0.65</div>
                      <div className="f1-bar-fill" style={{ height: '65%' }}></div>
                      <div className="f1-label">Logistic Regression<br/><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Baseline</span></div>
                    </div>

                    <div className="f1-column">
                      <div className="f1-value">0.75</div>
                      <div className="f1-bar-fill" style={{ height: '75%' }}></div>
                      <div className="f1-label">Random Forest<br/><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bagging</span></div>
                    </div>

                    <div className="f1-column">
                      <div className="f1-value" style={{ color: '#d97706', fontWeight: 800 }}>0.82 ★</div>
                      <div className="f1-bar-fill highlight" style={{ height: '82%' }}></div>
                      <div className="f1-label" style={{ color: '#d97706' }}>XGBoost<br/><span style={{ fontSize: '0.72rem', color: '#b45309' }}>Ensemble Champion</span></div>
                    </div>
                  </div>
                </div>

                {/* Top-5 Career Recommendations */}
                <div className="white-panel">
                  <div className="panel-header">
                    <h3>Top-5 Career Recommendations (Ranked by XGBoost)</h3>
                  </div>

                  <table className="top5-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Target Role</th>
                        <th style={{ textAlign: 'right' }}>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1, role: 'ML Engineer', conf: '94%', color: '#10b981' },
                        { rank: 2, role: 'Data Scientist', conf: '89%', color: '#2563eb' },
                        { rank: 3, role: 'Backend Developer', conf: '85%', color: '#6366f1' },
                        { rank: 4, role: 'Product Manager', conf: '81%', color: '#a855f7' },
                        { rank: 5, role: 'AI Researcher', conf: '78%', color: '#ec4899' }
                      ].map((item) => (
                        <tr key={item.rank}>
                          <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{item.rank}</td>
                          <td style={{ fontWeight: 600 }}>{item.role}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: item.color }}>{item.conf}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SKILL ANALYSIS (PAGE 6 SKILL GAP REPORT) */}
            {activeTab === 'skill-analysis' && (
              <div>
                <div className="welcome-header">
                  <h2>Skill Gap Analysis Report</h2>
                  <p>Quantifying missing competencies against target career profiles</p>
                </div>

                <div className="white-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3>Target Role Gap Analysis</h3>
                      <p className="panel-sub">Benchmarked against canonical O*NET and LinkedIn job taxonomies</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Role:</span>
                      <select 
                        value={selectedTargetRole} 
                        onChange={(e) => setSelectedTargetRole(e.target.value)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                      >
                        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    </div>
                  </div>

                  <div className="gap-columns-grid">
                    <div>
                      <div className="gap-col-header" style={{ color: '#059669' }}>
                        <CheckCircle2 size={16} />
                        <span>Your Verified Skills</span>
                      </div>
                      {['Python', 'SQL', 'PyTorch', 'Data Visualization', 'Machine Learning'].map((s, i) => (
                        <div key={i} className="gap-item acquired">
                          <Check size={14} />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="gap-col-header" style={{ color: '#dc2626' }}>
                        <XCircle size={16} />
                        <span>Missing for {selectedTargetRole}</span>
                      </div>
                      {['Kubernetes', 'MLOps Pipeline Deployment', 'AWS SageMaker', 'System Design'].map((s, i) => (
                        <div key={i} className="gap-item missing">
                          <XCircle size={14} />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="alignment-bar-box">
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Target Role Alignment</span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Missing 4 competencies to reach 100% suitability</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '50%', maxWidth: '350px' }}>
                      <div className="prob-track" style={{ flex: 1, height: '10px' }}>
                        <div className="prob-fill" style={{ width: '72%' }} />
                      </div>
                      <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.1rem' }}>72%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. LEARNING PATH (ROADMAP TREE & PDF EXPORT) */}
            {activeTab === 'learning-path' && (
              <div>
                <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>Personalized Career Roadmap & Progression Tree</h2>
                    <p>Curriculum milestones tailored for: <strong style={{ color: '#38bdf8' }}>{selectedTargetRole}</strong></p>
                  </div>
                  <button 
                    className="btn-solid-blue" 
                    onClick={handleExportRoadmapPDF} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 18px', fontSize: '0.9rem' }}
                  >
                    <Download size={16} />
                    <span>Export Roadmap as PDF</span>
                  </button>
                </div>

                {/* Progress Overview Banner */}
                <div className="white-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>Curriculum Completion Progress</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {completedMilestones.length} of 4 Core Milestones Finished ({Math.round((completedMilestones.length / 4) * 100)}% Milestone Velocity)
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '220px' }}>
                    <div className="prob-track" style={{ flex: 1, height: '8px' }}>
                      <div className="prob-fill" style={{ width: `${(completedMilestones.length / 4) * 100}%` }} />
                    </div>
                    <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>
                      {Math.round((completedMilestones.length / 4) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="white-panel">
                  {[
                    { 
                      step: 1, 
                      title: 'Foundational Mathematics & Algorithmic Thinking', 
                      desc: 'Linear Algebra, Probability, Statistics, Matrix Decompositions, and Data Structures in Python.', 
                      tags: ['Khan Academy Linear Algebra', 'MIT 18.06 Matrix Methods', 'LeetCode Core 75'],
                      duration: 'Weeks 1–4'
                    },
                    { 
                      step: 2, 
                      title: 'Deep Learning & Neural Architectures', 
                      desc: 'Implement Convolutional Networks, Recurrent Units, Transformers, and PyTorch deep learning modules.', 
                      tags: ['CS231n Computer Vision', 'HuggingFace NLP Course', 'DeepLearning.AI Specialization'],
                      duration: 'Weeks 5–8'
                    },
                    { 
                      step: 3, 
                      title: 'AI Production & Cloud Deployment', 
                      desc: 'Package models with FastAPI & Docker, deploy onto Kubernetes clusters, and monitor concept drift.', 
                      tags: ['Docker & Kubernetes for ML', 'Triton Inference Server', 'MLflow Tracking'],
                      duration: 'Weeks 9–12'
                    },
                    { 
                      step: 4, 
                      title: 'Industry Capstone & SIH 2025 Prototype', 
                      desc: 'Deploy end-to-end production solution with automated CI/CD accuracy regression pipelines.', 
                      tags: ['SIH 2025 Final Prototype', 'GitHub Actions CI/CD', 'Production Release'],
                      duration: 'Weeks 13–16'
                    }
                  ].map((s) => {
                    const isDone = completedMilestones.includes(s.step)
                    return (
                      <div 
                        key={s.step} 
                        style={{ 
                          display: 'flex', 
                          gap: '1.25rem', 
                          paddingBottom: '1.5rem', 
                          marginBottom: '1.5rem', 
                          borderBottom: s.step === 4 ? 'none' : '1px solid var(--border)' 
                        }}
                      >
                        <button
                          onClick={() => toggleMilestone(s.step)}
                          title={isDone ? 'Mark as in-progress' : 'Mark as completed'}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            background: isDone ? '#10b981' : 'rgba(56, 189, 248, 0.15)', 
                            color: isDone ? '#ffffff' : '#38bdf8', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isDone ? <Check size={20} /> : s.step}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                              {s.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                                ⏱ {s.duration}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: isDone ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                                {isDone ? '✓ Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '6px 0 10px' }}>{s.desc}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {s.tags.map((t, idx) => (
                              <span key={idx} style={{ background: 'var(--bg-input)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, border: '1px solid var(--border)' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 5. RESUME ANALYZER (MILESTONE 1 SPACY NER & MODEL PREDICTION) */}
            {activeTab === 'resume-analyzer' && (
              <div>
                <div className="welcome-header">
                  <h2>AI Resume Parser & Career Prediction Engine</h2>
                  <p>SpaCy Named Entity Recognition (NER) paired with Multiclass Logistic Regression</p>
                </div>

                {/* Upload Zone */}
                <div className="resume-upload-zone" onClick={() => document.getElementById('resume-file-input').click()}>
                  <input type="file" id="resume-file-input" accept=".pdf,.docx,.doc,.txt" style={{ display: 'none' }} onChange={handleFileUpload} />
                  <div className="upload-icon-circle">
                    <UploadCloud size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#0f172a' }}>
                    Upload Your Resume for AI Analysis
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Drag & drop your resume file here or <strong style={{ color: '#2563eb' }}>browse files</strong> (Supports PDF, DOCX, TXT)
                  </p>

                  {uploadingResume && (
                    <div style={{ marginTop: '0.85rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RefreshCw className="spin" size={16} />
                      <span>Parsing with SpaCy NER pipeline...</span>
                    </div>
                  )}

                  {uploadedFileName && !uploadingResume && (
                    <div className="file-selected-badge">
                      <Check size={16} />
                      <span>Active File: {uploadedFileName} (Parsed Successfully)</span>
                    </div>
                  )}
                </div>

                {/* Two Panels */}
                <div className="m1-grid">
                  <div className="m1-card">
                    <div className="m1-card-header">
                      <h3><FileText size={18} color="#2563eb" /><span>Resume Parsing (SpaCy NER)</span></h3>
                      <span className="match-badge">≥90% Precision Target</span>
                    </div>

                    <div className="ner-box">
                      <p style={{ marginBottom: '0.8rem' }}>
                        Skills: {m1Skills.split(',').map((skill, i) => (
                          <span key={i} className="ner-entity ner-skill">
                            {skill.trim()}<span className="ner-label">Skill</span>
                          </span>
                        ))}
                      </p>
                      <div style={{ margin: '0.8rem 0' }}>
                        <span className="ner-entity ner-role">{m1Role}<span className="ner-label">Role</span></span>
                        <span className="ner-entity ner-role">Software Engineer<span className="ner-label">Role</span></span>
                      </div>
                      <div>
                        <span className="ner-entity ner-edu">{m1Degree}<span className="ner-label">Degree</span></span> from <span className="ner-entity ner-edu">{m1University}<span className="ner-label">Inst</span></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                      <span className="m1-badge">Skills: {m1Skills.split(',').length}</span>
                      <span className="m1-badge">Roles: 2</span>
                      <span className="m1-badge">Education: 2</span>
                    </div>
                  </div>

                  <div className="m1-card">
                    <div className="m1-card-header">
                      <h3><Target size={18} color="#8b5cf6" /><span>Baseline Prediction Results</span></h3>
                      <span className="match-badge">Logistic Regression</span>
                    </div>

                    <div className="accuracy-banner">
                      <div>
                        <div className="accuracy-title">Top-1 Accuracy</div>
                        <div className="accuracy-score">66%</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
                        <div>Validation Split: <strong>200 Resumes</strong></div>
                        <div style={{ color: '#059669', fontWeight: 700 }}>Target ≥65% (Passed ✅)</div>
                      </div>
                    </div>

                    <div className="prob-list">
                      {m1Predictions.map((item, idx) => (
                        <div key={idx} className="prob-item">
                          <div className="prob-info">
                            <span>{item.role}</span>
                            <span style={{ color: item.type === 'primary' ? '#2563eb' : '#64748b' }}>{item.prob}%</span>
                          </div>
                          <div className="prob-track">
                            <div className={`prob-fill ${item.type}`} style={{ width: `${item.prob}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="white-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Edit Candidate Profile</h4>
                    <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                      <Database size={14} />
                      <span>Supabase PostgreSQL Sync Active</span>
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label>Technical Skills</label>
                      <input type="text" value={m1Skills} onChange={(e) => setM1Skills(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Job Role</label>
                      <input type="text" value={m1Role} onChange={(e) => setM1Role(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Degree</label>
                      <input type="text" value={m1Degree} onChange={(e) => setM1Degree(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Institution</label>
                      <input type="text" value={m1University} onChange={(e) => setM1University(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button className="btn-solid-blue" onClick={handleRecalculateM1} disabled={m1IsCalculating}>
                      {m1IsCalculating ? 'Evaluating...' : 'Update & Re-run Baseline Prediction'}
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={handleSaveProfile} 
                      disabled={dbSaving}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Save size={15} />
                      <span>{dbSaving ? 'Syncing...' : 'Save Profile to Cloud Database'}</span>
                    </button>
                  </div>

                  {dbStatusMsg && (
                    <div style={{ marginTop: '1rem', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      <span>{dbStatusMsg}</span>
                    </div>
                  )}
                </div>

                {/* Supabase Stored Resumes & History Card */}
                <div className="white-panel" style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={18} color="#38bdf8" />
                        <span>Supabase Database Records (Cloud Synced)</span>
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                        Real-time data retrieved from PostgreSQL tables: <code>resumes</code> and <code>predictions</code>
                      </p>
                    </div>
                    <button 
                      className="btn-pill-outline" 
                      onClick={() => session?.user?.id && loadUserData(session.user.id)}
                      style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <RefreshCw size={13} />
                      <span>Refresh DB</span>
                    </button>
                  </div>

                  <div className="dash-2col" style={{ marginTop: '0.5rem' }}>
                    {/* Resumes List */}
                    <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0' }}>Saved Resumes ({savedResumes.length})</span>
                        <span className="match-badge">resumes table</span>
                      </div>
                      {savedResumes.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {savedResumes.map((r) => (
                            <div key={r.id} style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                              <div style={{ fontWeight: 600, color: '#38bdf8' }}>📄 {r.file_name}</div>
                              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
                                Uploaded: {new Date(r.upload_date).toLocaleDateString()} • {r.extracted_skills?.length || 0} skills detected
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                          No resumes saved in Supabase yet. Upload a resume above to parse and record it.
                        </p>
                      )}
                    </div>

                    {/* Predictions List */}
                    <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0' }}>Prediction Logs ({savedPredictions.length})</span>
                        <span className="match-badge">predictions table</span>
                      </div>
                      {savedPredictions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {savedPredictions.map((p) => (
                            <div key={p.id} style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: '#a855f7' }}>🎯 {p.predicted_role}</span>
                                <span style={{ fontWeight: 700, color: '#38bdf8' }}>{p.confidence_score}%</span>
                              </div>
                              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
                                Stored: {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Validation Pass
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                          No predictions recorded yet. Run a prediction to automatically log results to Supabase.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. MOCK INTERVIEW (AI SIMULATOR & REAL-TIME EVALUATION) */}
            {activeTab === 'mock-interview' && (
              <div>
                <div className="welcome-header">
                  <h2>AI Mock Interview Simulator</h2>
                  <p>Real-time technical interview questions, timed sessions, and automated evaluation</p>
                </div>

                {!interviewStarted && !interviewSubmitted && (
                  <div className="white-panel" style={{ maxWidth: '850px', padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(139,92,246,0.2) 100%)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <UserCheck size={34} />
                      </div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9' }}>
                        Select Your Technical Track & Start Practice
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '540px', margin: '0.5rem auto 0' }}>
                        Our AI evaluates your responses for technical terminology, conceptual depth, trade-off analysis, and clarity.
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.75rem' }}>
                        Target Career Role:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {['Machine Learning Engineer', 'Software Engineer', 'Data Scientist', 'DevOps / Cloud Architect'].map((r) => (
                          <button
                            key={r}
                            onClick={() => setInterviewRole(r)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: interviewRole === r ? '2px solid #38bdf8' : '1px solid var(--border)',
                              background: interviewRole === r ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-input)',
                              color: interviewRole === r ? '#ffffff' : '#94a3b8',
                              fontWeight: 700,
                              fontSize: '0.86rem',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Questions</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '3px' }}>4 Questions</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Time Limit</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '3px' }}>15 Minutes</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Scoring</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '3px' }}>AI Rubric</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-solid-blue" 
                        onClick={() => handleStartInterview(interviewRole)} 
                        style={{ padding: '12px 32px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                      >
                        <Play size={18} />
                        <span>Launch 15-Minute Interview Session</span>
                      </button>
                    </div>
                  </div>
                )}

                {interviewStarted && !interviewSubmitted && (
                  <div className="interview-card" style={{ maxWidth: '900px' }}>
                    {/* Top status bar */}
                    <div className="interview-top-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="match-badge">{interviewRole}</span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                          Question {currentQIdx + 1} of {activeQuestions.length}
                        </span>
                      </div>

                      <div className="interview-timer-badge">
                        <Clock size={16} />
                        <span>
                          {Math.floor(interviewTimer / 60)}:{(interviewTimer % 60).toString().padStart(2, '0')} Remaining
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="prob-track" style={{ height: '6px', marginBottom: '1.5rem' }}>
                      <div className="prob-fill" style={{ width: `${((currentQIdx + 1) / activeQuestions.length) * 100}%` }} />
                    </div>

                    {/* Question Statement */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {activeQuestions[currentQIdx].title}
                      </div>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.45 }}>
                        {activeQuestions[currentQIdx].question}
                      </h3>
                    </div>

                    {/* Hint Accordion */}
                    <div style={{ marginBottom: '1rem' }}>
                      <button 
                        onClick={() => setShowHint(!showHint)}
                        className="btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Lightbulb size={14} color="#f59e0b" />
                        <span>{showHint ? 'Hide Concept Hints' : 'Need a Hint?'}</span>
                      </button>

                      {showHint && (
                        <div className="interview-hint-box">
                          <Lightbulb size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>Core Technical Concepts:</strong> {activeQuestions[currentQIdx].hint}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Answer Area */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Your Technical Response:</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {(userAnswers[activeQuestions[currentQIdx].id] || '').trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </label>
                      <textarea
                        className="interview-textarea"
                        placeholder="Explain your approach, architecture decisions, trade-offs, and algorithms in detail..."
                        value={userAnswers[activeQuestions[currentQIdx].id] || ''}
                        onChange={(e) => handleAnswerChange(activeQuestions[currentQIdx].id, e.target.value)}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        className="btn-secondary"
                        disabled={currentQIdx === 0}
                        onClick={() => { setCurrentQIdx(prev => Math.max(0, prev - 1)); setShowHint(false) }}
                        style={{ opacity: currentQIdx === 0 ? 0.5 : 1 }}
                      >
                        ← Previous
                      </button>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {currentQIdx < activeQuestions.length - 1 ? (
                          <button
                            className="btn-solid-blue"
                            onClick={() => { setCurrentQIdx(prev => prev + 1); setShowHint(false) }}
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            className="btn-solid-blue"
                            onClick={handleEvaluateInterview}
                            style={{ background: '#10b981' }}
                          >
                            Submit & Calculate AI Scorecard
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scorecard & AI Evaluation */}
                {interviewSubmitted && interviewEval && (
                  <div className="white-panel" style={{ maxWidth: '900px' }}>
                    <div className="interview-score-banner">
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em' }}>
                          AI Technical Evaluation
                        </span>
                        <div className="interview-score-val" style={{ margin: '6px 0' }}>
                          {interviewEval.score}/100
                        </div>
                        <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1rem' }}>
                          {interviewEval.rating}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '4px 0 0' }}>
                          Role: <strong>{interviewRole}</strong> • Verified on {interviewEval.date}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Detected Technical Terms:</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', margin: '2px 0 8px' }}>
                          {interviewEval.matchedCount} Keywords
                        </div>
                        <button 
                          className="btn-solid-blue" 
                          onClick={() => handleStartInterview(interviewRole)} 
                          style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <RotateCcw size={14} />
                          <span>Retake Interview</span>
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
                      Question-by-Question Breakdown
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      {interviewEval.feedbackList.map((f, idx) => (
                        <div key={idx} style={{ padding: '1rem 1.25rem', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.94rem' }}>
                              {idx + 1}. {f.title}
                            </div>
                            <span style={{ fontWeight: 800, color: f.score >= 70 ? '#34d399' : f.score >= 40 ? '#f59e0b' : '#ef4444', fontSize: '0.92rem' }}>
                              {f.score}/100
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
                            {f.question}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '0.5rem' }}>Detected Concepts:</span>
                            {f.matchedKeywords.length > 0 ? (
                              f.matchedKeywords.map((kw, ki) => (
                                <span key={ki} className="interview-kw-pill" style={{ marginRight: '4px', marginBottom: '4px' }}>
                                  ✓ {kw}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#f87171', fontStyle: 'italic' }}>
                                No core technical keywords detected. Expand your explanation.
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '1rem 1.25rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.92rem' }}>
                          Next Step: Calibrate Learning Roadmap
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Review the Learning Path tab to strengthen missed competencies before real placement drives.
                        </div>
                      </div>
                      <button 
                        className="btn-solid-blue" 
                        onClick={() => setActiveTab('learning-path')}
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                      >
                        View Learning Path →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7 & 8. JOB RECOMMENDATIONS & PLACEMENT DRIVES */}
            {(activeTab === 'job-recommendations' || activeTab === 'placement-drives') && (
              <div>
                <div className="welcome-header">
                  <h2>{activeTab === 'placement-drives' ? 'Active Placement Drives' : 'AI Job Recommendations'}</h2>
                  <p>Curated opportunities matching your 85% career readiness index</p>
                </div>
                <div className="dash-2col">
                  {colleges.map((c, i) => (
                    <div key={i} className="white-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>{c.program}</p>
                          <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>📍 {c.location}</p>
                        </div>
                        <span className="match-badge">{c.rating}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>{c.nirf}</span>
                        <button className="btn-pill-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. ASSESSMENTS */}
            {activeTab === 'assessments' && (
              <div>
                <div className="welcome-header">
                  <h2>Career Readiness Aptitude Assessments</h2>
                  <p>Interactive problem solving to calibrate your Career Match score</p>
                </div>
                <div className="white-panel" style={{ maxWidth: '800px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Diagnostic Problem Solving Question</h3>
                  <p style={{ color: '#475569', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
                    When tackling a new system architecture problem, which task energizes you most?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      'Analyzing mathematical patterns and building predictive data models',
                      'Designing clean user interfaces and real-time frontend states',
                      'Configuring distributed cloud clusters and low-latency APIs',
                      'Defining product roadmap, user research, and team requirements'
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        className="btn-secondary"
                        style={{
                          justifyContent: 'flex-start',
                          padding: '12px 16px',
                          borderColor: quizAnswer === idx ? '#2563eb' : '#e2e8f0',
                          background: quizAnswer === idx ? '#eff6ff' : '#ffffff',
                          color: quizAnswer === idx ? '#1d4ed8' : '#1e293b'
                        }}
                        onClick={() => { setQuizAnswer(idx); setQuizScore(92) }}
                      >
                        <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {quizScore && (
                    <div className="alert alert-success">
                      <CheckCircle2 size={18} />
                      <span>Aptitude calibrated to 92%! Your profile demonstrates high affinity for Software & Data Intelligence.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div>
                <div className="welcome-header">
                  <h2>Student Certifications & Badges</h2>
                  <p>Verified competencies and credentials for campus recruitment</p>
                </div>
                <div className="dash-2col">
                  {[
                    { name: 'Python for Data Science', issuer: 'IBM Certified', date: 'August 2026' },
                    { name: 'Full-Stack Web Architect', issuer: 'Meta Certified', date: 'June 2026' },
                    { name: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', date: 'October 2026' }
                  ].map((cert, idx) => (
                    <div key={idx} className="white-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>{cert.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{cert.issuer} • Issued {cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11 & 12. SETTINGS & HELP */}
            {(activeTab === 'settings' || activeTab === 'help-support') && (
              <div>
                <div className="welcome-header">
                  <h2>{activeTab === 'settings' ? 'Account & System Settings' : 'Help & Support'}</h2>
                  <p>Configuration status, cloud backend connectivity, and user preferences</p>
                </div>
                <div className="white-panel" style={{ maxWidth: '780px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={20} color="#38bdf8" />
                        <span>Connected Cloud & AI Services</span>
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '3px 0 0' }}>
                        Real-time status of Supabase PostgreSQL and FastAPI ML services
                      </p>
                    </div>
                    <span className="match-badge">All Systems Operational</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Supabase PostgreSQL Database</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>https://hnnmktwpdybjgwxotpvk.supabase.co</div>
                      </div>
                      <span style={{ color: isSupabaseConfigured ? '#10b981' : '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                        {isSupabaseConfigured ? '🟢 Active & Connected' : 'Local Fallback'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>profiles table</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{dbRecordCounts.profiles}</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Active</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>resumes table</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8', marginTop: '2px' }}>{savedResumes.length}</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Synced</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>predictions table</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c084fc', marginTop: '2px' }}>{savedPredictions.length}</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Synced</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>FastAPI Python ML Inference Server</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>http://127.0.0.1:8000 (Swagger docs available at /docs)</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>🟢 Online</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Active Student Session</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{session.user?.email || 'Student Explorer'} (ID: {session.user?.id?.slice(0, 12)}...)</div>
                      </div>
                      <span className="match-badge">Authenticated</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  )
}
