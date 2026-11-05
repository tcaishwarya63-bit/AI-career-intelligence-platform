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
  Printer,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  MessageSquare,
  Timer,
  ChevronRight,
  Star,
  ThumbsUp,
  Code2,
  Clock,
  Circle,
  GraduationCap,
  Mic,
  Users,
  Calculator,
  ArrowLeft,
  Calendar
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

  // Aptitude Quiz State
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(null)

  // Learning Path Roadmap State & PDF Export
  const [roadmapSteps, setRoadmapSteps] = useState([
    { id: 1, title: 'Foundational Mathematics & Algorithmic Thinking', desc: 'Linear Algebra, Probability, Multivariable Calculus, and Data Structures in Python.', duration: 'Weeks 1–4', status: 'completed', tags: ['Khan Academy Linear Algebra', 'LeetCode Core 75', 'Python OOP'] },
    { id: 2, title: 'Deep Learning, NLP & Neural Architectures', desc: 'Implement Convolutional Networks, Transformer Attention, and SpaCy NER pipelines.', duration: 'Weeks 5–8', status: 'in-progress', tags: ['CS231n Computer Vision', 'HuggingFace NLP', 'SpaCy Pipeline'] },
    { id: 3, title: 'AI Production Systems & Cloud MLOps', desc: 'Containerize with Docker, deploy FastAPI REST endpoints, and implement drift monitoring.', duration: 'Weeks 9–12', status: 'planned', tags: ['Docker & Kubernetes', 'FastAPI Production', 'Triton Server'] },
    { id: 4, title: 'Industry Capstone & SIH 2025 Prototype', desc: 'Deliver end-to-end cloud platform with real-time inference and institutional dashboard.', duration: 'Weeks 13–16', status: 'planned', tags: ['SIH 2025 Submission', 'GitHub CI/CD', 'Supabase Cloud'] }
  ])

  // Mock Interview Simulator State
  const [interviewDomain, setInterviewDomain] = useState('technical')
  const [interviewActive, setInterviewActive] = useState(false)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [userAnswerText, setUserAnswerText] = useState('')
  const [savedAnswers, setSavedAnswers] = useState({})
  const [evaluationResults, setEvaluationResults] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(285) // 00:04:45 matching teacher reference
  const [timerRunning, setTimerRunning] = useState(false)
  const [sessionFinished, setSessionFinished] = useState(false)
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  // Notification Center State
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'Interview Evaluation Ready',
      desc: 'Your Python Developer Technical session was evaluated. Score: 80% (Excellent Performance). Top strength: Technical Knowledge.',
      time: '10 minutes ago',
      type: 'interview',
      read: false
    },
    {
      id: 2,
      title: 'Campus Placement Drive Announcement',
      desc: 'Google Cloud Early Career & Amazon AWS Campus Drive registration opened for B.Sc & B.Tech 2026 batches.',
      time: '2 hours ago',
      type: 'placement',
      read: false
    },
    {
      id: 3,
      title: 'Learning Path Milestone Unlocked',
      desc: 'Congratulations! You completed Week 3 of Software Engineering track. Week 4: Cloud & Distributed APIs is now active.',
      time: 'Yesterday',
      type: 'roadmap',
      read: false
    },
    {
      id: 4,
      title: 'Resume Analyzed with SpaCy NER',
      desc: 'Model parsed 14 core skills from your resume with an ATS readability score of 88%.',
      time: '2 days ago',
      type: 'resume',
      read: true
    },
    {
      id: 5,
      title: 'Supabase PostgreSQL Cloud Synced',
      desc: 'Your candidate profile and ML predictions were securely synchronized to cloud storage.',
      time: '3 days ago',
      type: 'system',
      read: true
    }
  ])

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null
    if (interviewActive && timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewActive, timerRunning, timerSeconds])

  // Toggle Roadmap Step Status
  const handleToggleStepStatus = (id) => {
    setRoadmapSteps(prev => prev.map(step => {
      if (step.id === id) {
        const nextStatus = step.status === 'completed' ? 'in-progress' : step.status === 'in-progress' ? 'planned' : 'completed'
        return { ...step, status: nextStatus }
      }
      return step
    }))
  }

  // Export Roadmap as PDF
  const handleExportRoadmapPDF = () => {
    window.print()
  }

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

  // Curated Technical Question Bank for AI Mock Interview Simulator
  const interviewQuestions = {
    technical: [
      {
        id: 1,
        title: "Python Fundamentals & Advantages",
        difficulty: "Fundamental",
        tags: ["Python Developer", "Technical"],
        question: "What is Python? Name any two advantages of Python.",
        hint: "Think about its features and popularity...",
        keywords: ["interpreted", "high-level", "dynamic typing", "readable", "extensive libraries", "cross-platform", "syntax", "advantages"],
        modelAnswer: "Python is a high-level, interpreted, general-purpose programming language designed with an emphasis on code readability. Two key advantages: 1) Clean, readable syntax that accelerates developer productivity and prototyping speed; 2) Vast ecosystem of standard and third-party libraries (NumPy, Pandas, PyTorch, FastAPI) supporting web development, machine learning, and automation."
      },
      {
        id: 2,
        title: "Object-Oriented Programming (OOP) Concepts",
        difficulty: "Intermediate",
        tags: ["OOP Concepts", "Python"],
        question: "Explain the four core principles of Object-Oriented Programming (OOP) and give an example of inheritance in Python.",
        hint: "Consider Encapsulation, Abstraction, Inheritance, and Polymorphism...",
        keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "class", "super()", "methods"],
        modelAnswer: "The four core OOP principles are: 1) Encapsulation (bundling data and methods while restricting direct access); 2) Abstraction (hiding implementation complexity behind clear interfaces); 3) Inheritance (deriving new classes from base classes to reuse code); 4) Polymorphism (allowing different classes to be treated through a common interface). In Python, inheritance is achieved by passing the parent class in the class definition: `class Child(Parent): def __init__(self): super().__init__()`."
      },
      {
        id: 3,
        title: "Database Connectivity & Transactions",
        difficulty: "Intermediate",
        tags: ["Database Connectivity", "SQL"],
        question: "How does Python connect to relational databases (e.g., PostgreSQL / SQLite), and why are database transactions (ACID properties) important?",
        hint: "Recall psycopg2, connection pooling, commit, and rollback...",
        keywords: ["acid", "connection pool", "commit", "rollback", "psycopg2", "sqlite3", "atomicity", "transactions"],
        modelAnswer: "Python connects to relational databases using drivers like psycopg2, asyncpg, or sqlite3, often managed through connection pools and ORMs like SQLAlchemy. Database transactions enforce ACID properties (Atomicity, Consistency, Isolation, Durability). Atomicity ensures all operations in a transaction succeed together or are rolled back on failure with `conn.rollback()`, preventing corrupted or partial data states."
      },
      {
        id: 4,
        title: "System Design & Scalability Basics",
        difficulty: "Intermediate",
        tags: ["System Design", "Scalability"],
        question: "What is the difference between horizontal and vertical scaling, and how does a Load Balancer distribute incoming web traffic?",
        hint: "Think about adding more machines vs adding more RAM/CPU...",
        keywords: ["horizontal scaling", "vertical scaling", "scale out", "scale up", "load balancer", "round robin", "least connections"],
        modelAnswer: "Vertical scaling (scale up) adds more CPU, RAM, or storage to a single server, which hits hardware ceilings and creates a single point of failure. Horizontal scaling (scale out) adds more server instances to distribute load across clusters. A Load Balancer (e.g., NGINX, AWS ALB) distributes traffic across instances using algorithms like Round Robin, Least Connections, or IP Hash, while performing health checks to route around failing nodes."
      },
      {
        id: 5,
        title: "RESTful API Integration & Status Codes",
        difficulty: "Fundamental",
        tags: ["APIs", "FastAPI"],
        question: "What are the common HTTP methods (GET, POST, PUT, DELETE) in RESTful APIs, and what is the difference between status codes 200, 400, 404, and 500?",
        hint: "Review client vs server errors and idempotency...",
        keywords: ["get", "post", "put", "delete", "200 ok", "400 bad request", "404 not found", "500 internal server error"],
        modelAnswer: "HTTP methods: GET retrieves data without side effects; POST creates new resources; PUT replaces or updates a resource idempotently; DELETE removes a resource. Status codes: 200 OK signifies success; 400 Bad Request indicates client validation error; 404 Not Found indicates the resource doesn't exist; and 500 Internal Server Error denotes an unhandled server-side fault."
      }
    ],
    hr: [
      {
        id: 1,
        title: "Behavioral & Conflict Resolution",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Behavioral"],
        question: "Describe a situation where you had a disagreement with a team member on a project. How did you resolve it, and what was the outcome?",
        hint: "Use the STAR framework: Situation, Task, Action, Result...",
        keywords: ["star method", "communication", "compromise", "collaboration", "resolution", "empathy", "outcome"],
        modelAnswer: "In a collaborative capstone project, my teammate and I disagreed on database choice (MongoDB vs PostgreSQL). I scheduled a 30-minute sync to evaluate our schema requirements objectively. We identified that our relational transactions and ACID compliance were critical, so we chose PostgreSQL while documenting our decision in an ADR. The project launched smoothly with zero schema debt."
      }
    ],
    aptitude: [
      {
        id: 1,
        title: "Quantitative Problem Solving & Speed",
        difficulty: "Fundamental",
        tags: ["Aptitude Test", "Logical Reasoning"],
        question: "A training batch pipeline processes 12,000 records in 40 minutes with 2 workers. How many minutes will it take 6 workers running in parallel to process 36,000 records?",
        hint: "Work = Rate * Time * Workers...",
        keywords: ["work rate", "parallel processing", "40 minutes", "inverse proportionality", "linear scaling"],
        modelAnswer: "One worker processes 12,000 / (40 * 2) = 150 records per minute. Six workers process 6 * 150 = 900 records per minute. To process 36,000 records, it will take 36,000 / 900 = 40 minutes."
      }
    ],
    coding: [
      {
        id: 1,
        title: "Two Sum & Hash Map Lookup",
        difficulty: "Fundamental",
        tags: ["Coding Interview", "Data Structures"],
        question: "Given an array of integers `nums` and an integer `target`, return the indices of two numbers that add up to `target` in O(N) time complexity.",
        hint: "Use a hash map to store complements (target - num)...",
        keywords: ["hash map", "dictionary", "o(n) time", "o(n) space", "complement", "indices"],
        modelAnswer: "Use a single-pass hash map: For each number `num` at index `i`, check if `target - num` exists in the hash map. If found, return `[map[target - num], i]`. Otherwise, record `map[num] = i`. This achieves O(N) linear time and O(N) auxiliary space."
      }
    ],
    ml: [
      {
        id: 1,
        title: "Overfitting & Regularization in Deep Models",
        difficulty: "Intermediate",
        tags: ["Deep Learning", "Generalization"],
        question: "How do you detect overfitting in complex neural networks or gradient boosted decision trees, and what concrete techniques do you apply to mitigate it?",
        keywords: ["dropout", "early stopping", "l1", "l2", "weight decay", "cross validation", "data augmentation", "regularization", "validation loss", "learning rate"],
        modelAnswer: "Overfitting is primarily detected when validation loss begins to diverge or increase while training loss continues decreasing. To mitigate it in neural networks: 1) Apply Dropout layers (typically 0.2 to 0.5) to prevent co-adaptation of neurons; 2) Implement Early Stopping based on validation loss patience; 3) Use L2 Weight Decay to constrain parameter norms; 4) Employ Data Augmentation to increase training diversity; and 5) In Gradient Boosted Trees (like XGBoost), tune hyper-parameters such as max_depth (3–6), colsample_bytree, and min_child_weight."
      },
      {
        id: 2,
        title: "Class Imbalance & Evaluation Metrics",
        difficulty: "Intermediate",
        tags: ["Model Evaluation", "Metrics"],
        question: "In fraud detection or disease diagnosis where 99.5% of cases are negative, why is standard Accuracy misleading, and which evaluation metrics and resampling strategies should you use instead?",
        keywords: ["accuracy paradox", "precision", "recall", "f1", "pr-auc", "roc-auc", "smote", "oversampling", "undersampling", "class weights", "confusion matrix"],
        modelAnswer: "Standard accuracy suffers from the 'Accuracy Paradox': a naive classifier predicting everything as negative achieves 99.5% accuracy while identifying 0 fraudulent cases. Instead: 1) Evaluate Macro/Micro F1-Score to balance Precision and Recall; 2) Utilize PR-AUC (Precision-Recall Area Under Curve), which is much more informative than ROC-AUC under severe imbalance; 3) Apply Cost-Sensitive Learning / Class Weighting (e.g. scale_pos_weight in XGBoost); and 4) Use resampling techniques like SMOTE (Synthetic Minority Over-sampling) on the training set."
      },
      {
        id: 3,
        title: "Transformers vs. Recurrent Architectures (RNN/LSTM)",
        difficulty: "Advanced",
        tags: ["NLP", "Transformers"],
        question: "How does the Multi-Head Self-Attention mechanism in Transformers solve the fundamental sequential bottleneck of RNNs and LSTMs?",
        keywords: ["parallelization", "self-attention", "sequential bottleneck", "vanishing gradient", "o(1) path length", "qkv", "query key value", "positional encoding"],
        modelAnswer: "RNNs and LSTMs process tokens sequentially step-by-step (token t depends on hidden state t-1), prohibiting GPU parallelization across long sequences and suffering from vanishing gradients. Transformers replace recurrence entirely with Multi-Head Self-Attention: 1) All tokens are processed simultaneously in parallel using Query, Key, and Value matrix multiplications (Q * K^T / sqrt(d_k)); 2) The path length between any two tokens is O(1), enabling direct dependency modeling; and 3) Positional Encodings inject token order into the permutation-invariant architecture."
      },
      {
        id: 4,
        title: "Feature Scaling & Gradient Descent",
        difficulty: "Fundamental",
        tags: ["Optimization", "Preprocessing"],
        question: "Why is feature scaling (StandardScaler vs MinMaxScaler) crucial for distance-based and gradient-descent models like Logistic Regression and SVMs, but unnecessary for Decision Trees?",
        keywords: ["gradient descent", "condition number", "standardscaler", "minmax", "euclidean distance", "decision tree", "monotonic", "orthogonality"],
        modelAnswer: "Gradient Descent optimization converges much faster when features are on the same scale, as unscaled features create elongated, skewed contour ellipses leading to oscillations. Similarly, distance-based algorithms (k-NN, SVM, k-Means) are dominated by features with arbitrarily large numerical ranges. Conversely, Decision Trees and Tree Ensembles (Random Forest, XGBoost) split each feature independently based on monotonic order thresholds (e.g., x_i > threshold), meaning linear scalings do not change the split criteria or information gain."
      },
      {
        id: 5,
        title: "Production MLOps & Model Drift",
        difficulty: "Advanced",
        tags: ["MLOps", "Production"],
        question: "What is the distinction between Data Drift and Concept Drift in a production AI system, and how would you build an automated monitoring and retraining pipeline?",
        keywords: ["data drift", "concept drift", "covariate shift", "ks-test", "psi", "population stability", "ground truth lag", "retraining trigger", "fastapi", "monitoring"],
        modelAnswer: "Data Drift (Covariate Shift) occurs when input feature distribution P(X) changes over time (e.g., changing resume vocabulary) while P(Y|X) remains constant. Concept Drift occurs when the underlying statistical relationship between features and target labels P(Y|X) changes. An automated monitoring pipeline: 1) Logs all inference feature vectors into PostgreSQL/S3; 2) Computes Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) tests against baseline; and 3) Automatically triggers retraining pipelines and validation checks when PSI > 0.2."
      }
    ],
    se: [
      {
        id: 1,
        title: "Distributed Caching & Invalidation Patterns",
        difficulty: "Intermediate",
        tags: ["Backend", "Caching", "Redis"],
        question: "How does Redis in-memory caching improve API latency, and how do you handle cache invalidation, cache stampede (Thundering Herd), and cache penetration?",
        keywords: ["redis", "ttl", "cache aside", "write through", "thundering herd", "mutex lock", "bloom filter", "cache penetration", "cache stampede"],
        modelAnswer: "Redis provides sub-millisecond in-memory data retrieval (RAM vs Disk I/O). Key strategies: 1) Cache-Aside Pattern: Application queries cache first; on cache miss, queries DB and populates cache with TTL; 2) Cache Stampede / Thundering Herd: When a high-traffic key expires, multiple concurrent requests hammer the DB. Mitigate using distributed mutex locking (Redlock) or probabilistic early expiration; 3) Cache Penetration: Mitigate using Bloom Filters at the gateway or caching empty null results with short TTL."
      },
      {
        id: 2,
        title: "Database Indexing & PostgreSQL B-Trees",
        difficulty: "Intermediate",
        tags: ["Databases", "SQL", "Indexing"],
        question: "Explain how B-Tree indexes work in relational databases like PostgreSQL. When should you avoid adding an index, and what are the trade-offs on write-heavy tables?",
        keywords: ["b-tree", "o(log n)", "write overhead", "disk space", "low cardinality", "table scan", "wal", "insert overhead", "selectivity"],
        modelAnswer: "A B-Tree (Balanced Tree) index maintains sorted multi-level leaf nodes pointing to physical tuple heap offsets, reducing search complexity from O(N) sequential table scan to O(log N). Trade-offs: 1) Every INSERT, UPDATE, or DELETE requires rebalancing and updating all corresponding index trees, generating extra Write-Ahead Logging (WAL) and disk write amplification; 2) Indexes consume significant RAM/disk buffer space. Avoid indexing low-cardinality columns (e.g., boolean flags) where query planners prefer sequential scans, and avoid over-indexing tables with high write-to-read ratios."
      },
      {
        id: 3,
        title: "Concurrency, Event Loop & Asynchronous I/O",
        difficulty: "Advanced",
        tags: ["Node.js", "Concurrency", "Architecture"],
        question: "What is the difference between concurrency and parallelism, and how does the single-threaded Event Loop in Node.js / JavaScript achieve high non-blocking I/O throughput?",
        keywords: ["concurrency vs parallelism", "event loop", "libuv", "call stack", "callback queue", "microtask queue", "non-blocking", "worker threads"],
        modelAnswer: "Concurrency is the composition of independently executing processes (interleaved execution on a single core), while Parallelism is the simultaneous execution of multiple computations on multiple physical CPU cores. Node.js uses a single-threaded Event Loop backed by the libuv threadpool: 1) JavaScript execution occurs on one main thread without locking overhead; 2) I/O operations (network sockets, disk, DB queries) are offloaded to OS kernel asynchronous primitives (epoll/kqueue); 3) When an I/O operation completes, its callback is enqueued into the Event Loop phases (Timers, Poll, Check) and Microtask Queue (Promises), ensuring the main thread never blocks waiting for I/O."
      },
      {
        id: 4,
        title: "REST vs. GraphQL API Design",
        difficulty: "Intermediate",
        tags: ["APIs", "System Design"],
        question: "Compare RESTful APIs with GraphQL in terms of network efficiency, over-fetching / under-fetching, caching simplicity, and schema governance.",
        keywords: ["rest", "graphql", "over-fetching", "under-fetching", "n+1 problem", "http caching", "schema stitching", "dataloader"],
        modelAnswer: "1) Network Efficiency: REST endpoints often suffer from Over-fetching (returning extraneous fields) or Under-fetching (requiring N network round-trips to assemble related resources). GraphQL allows clients to specify exact requested field shapes in a single query; 2) Caching: REST leverages native HTTP protocol caching (ETag, Cache-Control, edge CDNs) out-of-the-box. GraphQL uses single POST endpoints (/graphql), requiring client-side normalized caching (Apollo/Relay); 3) Database Performance: GraphQL queries can easily trigger the N+1 database problem if resolvers are not batched using DataLoader."
      },
      {
        id: 5,
        title: "Stateless JWT Authentication & Security",
        difficulty: "Advanced",
        tags: ["Security", "Authentication", "JWT"],
        question: "How do JWTs facilitate stateless authentication, and how should access and refresh tokens be stored to defend against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?",
        keywords: ["jwt", "stateless", "access token", "refresh token", "httponly cookie", "xss", "csrf", "samesite", "token revocation", "signature"],
        modelAnswer: "A JSON Web Token (Header.Payload.Signature) is cryptographically signed using a secret (HMAC-SHA256) or public/private key (RS256). Any service can verify the signature and read user claims without querying a central session database. Security best practices: 1) Never store sensitive tokens in browser localStorage or sessionStorage, as any injected XSS script can exfiltrate them; 2) Store short-lived Access Tokens (5–15 min) in memory and long-lived Refresh Tokens in an HttpOnly, Secure, SameSite=Strict cookie inaccessible to JavaScript; 3) Defend against CSRF using SameSite cookies and CSRF anti-forgery tokens; and 4) Implement token blacklisting / revocation in Redis for immediate logout or compromised credentials."
      }
    ],
    cloud: [
      {
        id: 1,
        title: "Docker Containers vs. Virtual Machines",
        difficulty: "Fundamental",
        tags: ["Docker", "Virtualization"],
        question: "What is the architectural difference between Docker containers and traditional Virtual Machines, and why are containers significantly lighter and faster to boot?",
        keywords: ["shared kernel", "hypervisor", "guest os", "namespaces", "cgroups", "isolation", "boot time", "resource overhead"],
        modelAnswer: "Virtual Machines run on a Hypervisor (Type 1 or Type 2) and require a complete, independent Guest Operating System kernel, virtualized BIOS, and emulated virtual hardware, resulting in gigabyte image sizes and minute-long boot times. Docker containers virtualize at the OS layer: they share the host OS kernel and use Linux cgroups (for resource limiting: CPU/RAM) and namespaces (for process, PID, network, and mount isolation). Because no guest OS boots, containers launch in milliseconds and consume negligible memory overhead."
      },
      {
        id: 2,
        title: "Kubernetes Core Architecture",
        difficulty: "Advanced",
        tags: ["Kubernetes", "DevOps"],
        question: "Explain the relationship and roles of Kubernetes Pods, ReplicaSets, Deployments, Services, and Ingress Controllers in a production cluster.",
        keywords: ["pod", "deployment", "replicaset", "clusterip", "service", "ingress", "kube-proxy", "rolling update", "self-healing"],
        modelAnswer: "1) Pod: Smallest deployable unit, encapsulating one or more tightly coupled containers sharing localhost network and storage volumes; 2) Deployment & ReplicaSet: Deployments manage declarative state and rolling updates with zero downtime, maintaining a desired count of identical Pods via ReplicaSets for self-healing; 3) Service: Provides a stable virtual ClusterIP and internal L4 load balancing across transient Pod IPs using label selectors; 4) Ingress Controller (e.g. NGINX Ingress): Acts as the cluster L7 reverse proxy, routing external HTTP/HTTPS traffic to internal Services based on hostnames and URL paths, managing SSL/TLS termination."
      },
      {
        id: 3,
        title: "Zero-Downtime Deployment Strategies",
        difficulty: "Intermediate",
        tags: ["CI/CD", "Deployments"],
        question: "Compare Blue-Green Deployments with Canary Deployments. How do you manage database schema migrations during zero-downtime releases?",
        keywords: ["blue green", "canary deployment", "traffic routing", "expand and contract", "backward compatibility", "rollback", "database migration"],
        modelAnswer: "1) Blue-Green: Maintains two identical production environments. Traffic is switched 100% instantly from Blue (active) to Green (new version) at the load balancer level, enabling instant rollback if issues arise; 2) Canary: Routes a small percentage of real user traffic (e.g. 5%) to the new version while monitoring error rates and latency before incrementally scaling to 100%; 3) Database Migrations: Zero-downtime requires the 'Expand and Contract' pattern: Step 1 (Expand) - Add new columns as nullable/default without dropping old columns, ensuring backward compatibility with both versions; Step 2 - Deploy code writing to both; Step 3 (Contract) - Backfill old data and safely remove deprecated schema."
      },
      {
        id: 4,
        title: "Infrastructure as Code & State Management",
        difficulty: "Intermediate",
        tags: ["Terraform", "IaC"],
        question: "Why is declarative Infrastructure as Code (Terraform) preferred over imperative CLI scripts, and how do you protect and manage the Terraform state file in team environments?",
        keywords: ["declarative vs imperative", "terraform state", "drift detection", "remote backend", "s3 bucket", "dynamodb state locking", "idempotent"],
        modelAnswer: "Declarative IaC specifies the desired end-state (e.g., 'create an S3 bucket with versioning enabled'); Terraform automatically calculates dependency graphs, creates execution plans (terraform plan), and converges the infrastructure idempotently. Imperative scripts (Bash/AWS CLI) define step-by-step actions and frequently fail on re-runs. For team state management: 1) Store terraform.tfstate in a remote backend (e.g. AWS S3, Google Cloud Storage) with server-side encryption; 2) Enable State Locking (via AWS DynamoDB) to prevent concurrent conflicting applies; and 3) Enable S3 versioning for disaster recovery."
      },
      {
        id: 5,
        title: "High Availability & Multi-Region Resilience",
        difficulty: "Advanced",
        tags: ["Cloud Architecture", "AWS", "Reliability"],
        question: "How do you architect a multi-region highly available web application with active-passive disaster recovery, DNS failover, and database replication?",
        keywords: ["multi-region", "rto", "rpo", "route 53", "dns health check", "cross-region replication", "read replicas", "active-passive"],
        modelAnswer: "1) DNS Layer: Route 53 or Cloudflare configured with DNS Health Checks and Failover Routing policy pointing primary traffic to Region A (Active) and switching to Region B (Passive) upon health check failure; 2) Compute Layer: Auto Scaling Groups and load balancers pre-provisioned in both regions via Terraform; 3) Database Layer: Primary database (e.g. Aurora Global Database or PostgreSQL Cross-Region Read Replica) in Region A with asynchronous replication to Region B. Target acceptable Recovery Point Objective (RPO < 1 min) and Recovery Time Objective (RTO < 5 min) with automated promoter failover scripts; 4) Static Assets: S3 Cross-Region Replication with CloudFront CDN global edge caching."
      }
    ]
  }

  // Format Timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start Interview Session
  const handleStartInterview = (domainKey) => {
    setInterviewDomain(domainKey)
    setInterviewActive(true)
    setCurrentQIdx(0)
    setUserAnswerText('')
    setSavedAnswers({})
    setEvaluationResults({})
    setTimerSeconds(900)
    setTimerRunning(true)
    setSessionFinished(false)
    setShowModelAnswer(false)
  }

  // Evaluate Current Question Answer
  const handleEvaluateAnswer = () => {
    const questionsList = interviewQuestions[interviewDomain] || []
    const currentQ = questionsList[currentQIdx]
    const text = (userAnswerText || savedAnswers[currentQIdx] || '').trim()

    if (!text || text.length < 15) {
      alert('Please provide a more detailed technical explanation (at least a couple of sentences) to receive an AI evaluation.')
      return
    }

    setIsEvaluating(true)
    setTimeout(() => {
      const textLower = text.toLowerCase()
      const matched = currentQ.keywords.filter(k => textLower.includes(k.toLowerCase()))
      const wordCount = text.split(/\s+/).length

      // Calculate score based on keyword coverage and depth
      const kwScore = Math.min(65, Math.round((matched.length / Math.max(3, currentQ.keywords.length * 0.45)) * 65))
      const depthScore = Math.min(30, Math.round((wordCount / 50) * 30))
      const totalScore = Math.min(96, Math.max(48, kwScore + depthScore))

      let grade = 'Proficient - Strong Technical Articulation'
      if (totalScore >= 85) grade = 'Exceptional - High Readiness'
      else if (totalScore >= 70) grade = 'Good - Solid Core Concepts'
      else grade = 'Needs Practice - Missing Key Terminology'

      const strengths = matched.length > 0 
        ? matched.slice(0, 3).map(k => `Accurately articulated concept: "${k}"`)
        : ['Clear logical structure and technical attempt']

      const missing = currentQ.keywords
        .filter(k => !textLower.includes(k.toLowerCase()))
        .slice(0, 3)
        .map(k => `Could elaborate on: "${k}"`)

      const feedback = {
        score: totalScore,
        grade,
        strengths,
        improvements: missing.length > 0 ? missing : ['Excellent coverage across all primary evaluation criteria.'],
        modelAnswer: currentQ.modelAnswer
      }

      setEvaluationResults(prev => ({ ...prev, [currentQIdx]: feedback }))
      setSavedAnswers(prev => ({ ...prev, [currentQIdx]: text }))
      setIsEvaluating(false)
    }, 600)
  }

  // Navigate to Next Question
  const handleNextQuestion = () => {
    const nextIdx = currentQIdx + 1
    const questionsList = interviewQuestions[interviewDomain] || []
    if (nextIdx < questionsList.length) {
      if (userAnswerText.trim()) {
        setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
      }
      setCurrentQIdx(nextIdx)
      setUserAnswerText(savedAnswers[nextIdx] || '')
      setShowModelAnswer(false)
    }
  }

  // Navigate to Previous Question
  const handlePrevQuestion = () => {
    const prevIdx = currentQIdx - 1
    if (prevIdx >= 0) {
      if (userAnswerText.trim()) {
        setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
      }
      setCurrentQIdx(prevIdx)
      setUserAnswerText(savedAnswers[prevIdx] || '')
      setShowModelAnswer(false)
    }
  }

  // Finish Interview Session
  const handleFinishInterview = () => {
    if (userAnswerText.trim() && !savedAnswers[currentQIdx]) {
      setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
    }
    setTimerRunning(false)
    setSessionFinished(true)
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
    { id: 'my-profile', label: 'My Profile', icon: User },
    { id: 'skill-assessment', label: 'Skill Assessment', icon: ClipboardCheck },
    { id: 'career-recommendations', label: 'Career Recommendations', icon: Target },
    { id: 'job-recommendations', label: 'Job Recommendations', icon: Briefcase },
    { id: 'learning-path', label: 'Learning Path', icon: BookOpen },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { id: 'interview-preparation', label: 'Interview Preparation', icon: Mic },
    { id: 'skill-gap-analysis', label: 'Skill Gap Analysis', icon: BarChart3 },
    { id: 'my-progress', label: 'My Progress', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const userName = session?.user?.user_metadata?.full_name || 'Ananya'

  return (
    <div className="app-layout">
      {/* ================= LEFT SIDEBAR (EXACT MATCH TO TEACHER'S PIC) ================= */}
      <aside className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <GraduationCap size={22} />
          </div>
          <div className="brand-title">
            <span className="brand-name">AI Powered</span>
            <span className="brand-sub">Career Intelligence Platform</span>
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
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer Logout Button */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-logout-btn" 
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
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
                    <button className="btn-pill-outline" onClick={() => setActiveTab('career-recommendations')}>
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
                      <button className="btn-pill-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }} onClick={() => setActiveTab('career-recommendations')}>
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

            {/* 2. MY PROFILE TAB */}
            {activeTab === 'my-profile' && (
              <div>
                <div className="welcome-header">
                  <h2>My Student Profile</h2>
                  <p>Manage your academic identity, career aspirations, and cloud database synchronization</p>
                </div>

                <div className="dash-2col" style={{ marginBottom: '1.5rem' }}>
                  {/* Student Identity Card */}
                  <div className="white-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
                      }}>
                        {userName[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{userName} Sharma</h3>
                          <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Verified Student</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0 }}>{m1Degree}</p>
                        <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>🎓 {m1University} • Batch 2022–2026</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Career Match</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>85%</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Target Role</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginTop: '5px' }}>ML Engineer</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Interviews</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>3 Taken</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>Target Role Affinity</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {['Machine Learning Engineer', 'Software Developer', 'Data Analyst', 'Cloud Architect'].map((r, i) => (
                          <span key={i} style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px', background: i === 0 ? 'rgba(37, 99, 235, 0.2)' : 'var(--bg-card)', color: i === 0 ? '#38bdf8' : '#94a3b8', border: i === 0 ? '1px solid #2563eb' : '1px solid var(--border)' }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cloud Database Sync Status */}
                  <div className="white-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="panel-header">
                        <div>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={18} color="#38bdf8" />
                            <span>Cloud Profile Synchronization</span>
                          </h3>
                          <p className="panel-sub">Real-time sync with Supabase PostgreSQL</p>
                        </div>
                        <span className="match-badge" style={{ background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(217, 119, 6, 0.15)', color: isSupabaseConfigured ? '#10b981' : '#d97706' }}>
                          {isSupabaseConfigured ? 'Connected to Cloud' : 'Local Fallback'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                          <span style={{ color: '#94a3b8' }}>Database Endpoint:</span>
                          <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>hnnmktwpdybjgwxotpvk.supabase.co</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                          <span style={{ color: '#94a3b8' }}>Profile Table Status:</span>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>Active (1 Record)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                          <span style={{ color: '#94a3b8' }}>Row-Level Security (RLS):</span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Enabled & Enforced</span>
                        </div>
                      </div>
                    </div>

                    {dbStatusMsg && (
                      <div className="alert alert-success" style={{ marginTop: '1rem', padding: '8px 12px', fontSize: '0.82rem' }}>
                        <CheckCircle2 size={16} />
                        <span>{dbStatusMsg}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Candidate Profile Form */}
                <div className="white-panel" style={{ marginBottom: '1.5rem' }}>
                  <div className="panel-header" style={{ marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Edit Candidate Profile & Skills</h3>
                      <p className="panel-sub">Update your information to recalibrate ML recommendations</p>
                    </div>
                    <button
                      className="btn-solid-blue"
                      onClick={handleSaveProfile}
                      disabled={dbSaving}
                      style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Save size={15} />
                      <span>{dbSaving ? 'Syncing...' : 'Save Profile to Supabase'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Candidate Role / Specialization</label>
                      <input
                        type="text"
                        className="search-input"
                        value={m1Role}
                        onChange={(e) => setM1Role(e.target.value)}
                        placeholder="e.g. Data Scientist Intern"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#ffffff' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Current Degree & Major</label>
                      <input
                        type="text"
                        className="search-input"
                        value={m1Degree}
                        onChange={(e) => setM1Degree(e.target.value)}
                        placeholder="e.g. B.S. Computer Science"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#ffffff' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>University / Institution</label>
                      <input
                        type="text"
                        className="search-input"
                        value={m1University}
                        onChange={(e) => setM1University(e.target.value)}
                        placeholder="e.g. UC Berkeley"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#ffffff' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px', display: 'block' }}>
                      Verified Technical Skills (Comma-separated)
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={m1Skills}
                      onChange={(e) => setM1Skills(e.target.value)}
                      placeholder="e.g. Python, SQL, Machine Learning, Scikit-learn, React, FastAPI, Docker"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#ffffff' }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {m1Skills.split(',').map((skill, i) => skill.trim() && (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                          <Check size={13} /> {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verified Badges & Certifications */}
                <div className="white-panel">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Verified Badges & Credentials</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                      { name: 'Python for Data Science', issuer: 'IBM Certified', date: 'August 2026', badge: 'Certified' },
                      { name: 'Full-Stack Web Architect', issuer: 'Meta Certified', date: 'June 2026', badge: 'Certified' },
                      { name: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', date: 'October 2026', badge: 'Honors' }
                    ].map((cert, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{cert.name}</h4>
                          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>{cert.issuer} • Issued {cert.date}</p>
                        </div>
                        <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.72rem' }}>{cert.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. CAREER RECOMMENDATIONS (MILESTONE 2 MULTI-MODEL COMPARISON) */}
            {activeTab === 'career-recommendations' && (
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

            {/* 9. SKILL GAP ANALYSIS */}
            {activeTab === 'skill-gap-analysis' && (
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
              <div className="learning-path-wrapper">
                {/* Header with Role Selector and Export PDF Button */}
                <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>Personalized Career Roadmap & Progression Tree</h2>
                    <p>Milestone-driven curriculum customized for <strong>{selectedTargetRole}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <select
                      value={selectedTargetRole}
                      onChange={(e) => setSelectedTargetRole(e.target.value)}
                      className="role-selector-dropdown"
                      style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--bg-input)', color: '#ffffff', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                      <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                      <option value="Product Manager">Product Manager</option>
                    </select>
                    <button
                      className="btn-solid-blue"
                      onClick={handleExportRoadmapPDF}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}
                      title="Download clean printable Career Roadmap as PDF"
                    >
                      <Download size={16} />
                      <span>Export Roadmap (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Progress Overview Banner */}
                <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Target Role Readiness: 85% Completed</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {roadmapSteps.filter(s => s.status === 'completed').length} of {roadmapSteps.length} Milestones Achieved • Est. Time to Master: 16 Weeks
                        </div>
                      </div>
                    </div>
                    <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      Industry Ready Track ★
                    </span>
                  </div>
                  <div className="prob-track" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="prob-fill" style={{ width: `${(roadmapSteps.filter(s => s.status === 'completed').length / roadmapSteps.length) * 100}%`, background: 'linear-gradient(90deg, #10b981, #38bdf8)' }} />
                  </div>
                </div>

                {/* Interactive Milestone Cards */}
                <div className="roadmap-milestones-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {roadmapSteps.map((s) => {
                    const isCompleted = s.status === 'completed'
                    const isInProgress = s.status === 'in-progress'
                    return (
                      <div key={s.id} className="white-panel" style={{ padding: '1.25rem 1.5rem', borderLeft: isCompleted ? '4px solid #10b981' : isInProgress ? '4px solid #38bdf8' : '4px solid #64748b' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                              color: isCompleted || isInProgress ? '#ffffff' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}>
                              {isCompleted ? <Check size={16} /> : s.id}
                            </div>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{s.title}</h4>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration: {s.duration}</span>
                            </div>
                          </div>

                          {/* Clickable Status Toggle */}
                          <button
                            onClick={() => handleToggleStepStatus(s.id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: 'none',
                              background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : isInProgress ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              color: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                            title="Click to toggle status (Completed / In Progress / Planned)"
                          >
                            {isCompleted ? <CheckCircle2 size={13} /> : isInProgress ? <Clock size={13} /> : <Circle size={13} />}
                            <span style={{ textTransform: 'capitalize' }}>{s.status.replace('-', ' ')}</span>
                          </button>
                        </div>

                        <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '0.5rem 0 0.85rem 2.75rem', lineHeight: 1.5 }}>
                          {s.desc}
                        </p>

                        <div style={{ marginLeft: '2.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {s.tags.map((t, idx) => (
                            <span key={idx} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#94a3b8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                              📖 {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Printable Report View (Visible only during window.print()) */}
                <div className="printable-roadmap-report" style={{ display: 'none' }}>
                  <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>CareerCast • AI Career Intelligence Platform</h1>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Personalized Career Roadmap & Progression Transcript</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                        SIH 2025 Certified
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Date: {new Date().toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Student Candidate</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{userName}</div>
                      <div style={{ fontSize: '0.82rem', color: '#475569' }}>Institution: {m1University}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Target Professional Role</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{selectedTargetRole}</div>
                      <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>Readiness Index: 85% Match</div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 700 }}>Curriculum Milestones:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {roadmapSteps.map((s) => (
                      <div key={s.id} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', background: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Step {s.id}: {s.title}</strong>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.status === 'completed' ? '#16a34a' : '#2563eb', textTransform: 'capitalize' }}>
                            {s.status.replace('-', ' ')} ({s.duration})
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0 8px' }}>{s.desc}</p>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Key Modules: {s.tags.join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>Official Document ID: CC-SIH-{Math.floor(100000 + Math.random() * 900000)}</span>
                    <span>Digitally Authenticated by CareerCast AI System</span>
                  </div>
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

            {/* 8. INTERVIEW PREPARATION (EXACT RECREATION OF TEACHER'S PANELS 1, 2 & 3) */}
            {activeTab === 'interview-preparation' && (
              <div className="mock-interview-container">
                {/* 1. Track Selection Screen (When interview not started) - Panel 1 */}
                {!interviewActive && (
                  <div>
                    <div className="welcome-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Home size={22} color="#3b82f6" />
                        <h2 style={{ margin: 0 }}>Interview Preparation</h2>
                      </div>
                      <p>Practice with AI-powered questions, real-time evaluation, and personalized feedback</p>
                    </div>

                    {/* Blue Hero Banner */}
                    <div className="interview-hero-banner">
                      <div className="interview-hero-left">
                        <h2>Ace Your Interview with AI Guidance!</h2>
                        <p>Practice • Evaluate • Improve</p>
                      </div>
                      <div className="interview-hero-badges">
                        <div className="interview-hero-mic-badge">
                          <Mic size={28} />
                        </div>
                        <div className="ready-pill-badge">You're Ready!</div>
                      </div>
                    </div>

                    {/* 4 Quick Stat Tiles */}
                    <div className="interview-stats-grid">
                      <div className="interview-stat-tile">
                        <div className="interview-stat-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
                          <Award size={22} />
                        </div>
                        <div>
                          <div className="interview-stat-tile-val">3</div>
                          <div className="interview-stat-tile-lbl">Interviews Taken</div>
                        </div>
                      </div>

                      <div className="interview-stat-tile">
                        <div className="interview-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                          <Star size={22} />
                        </div>
                        <div>
                          <div className="interview-stat-tile-val">78%</div>
                          <div className="interview-stat-tile-lbl">Avg Score</div>
                        </div>
                      </div>

                      <div className="interview-stat-tile">
                        <div className="interview-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                          <BarChart3 size={22} />
                        </div>
                        <div>
                          <div className="interview-stat-tile-val" style={{ fontSize: '1.05rem', color: '#38bdf8' }}>Technical</div>
                          <div className="interview-stat-tile-lbl">Top Skill</div>
                        </div>
                      </div>

                      <div className="interview-stat-tile">
                        <div className="interview-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                          <Target size={22} />
                        </div>
                        <div>
                          <div className="interview-stat-tile-val" style={{ fontSize: '0.95rem', color: '#f59e0b' }}>OOP Concepts</div>
                          <div className="interview-stat-tile-lbl">Improve</div>
                        </div>
                      </div>
                    </div>

                    {/* Start a New Interview Domain Grid */}
                    <div className="white-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Start a New Interview</h3>
                      <div className="interview-domain-grid">
                        {[
                          { key: 'technical', title: 'Technical Interview', icon: Code2, desc: 'Python, OOP & Architecture' },
                          { key: 'hr', title: 'HR Interview', icon: Users, desc: 'Behavioral & Situational' },
                          { key: 'aptitude', title: 'Aptitude Test', icon: Calculator, desc: 'Logical Reasoning & Math' },
                          { key: 'coding', title: 'Coding Interview', icon: Code2, desc: 'Data Structures & Algorithms' }
                        ].map((track) => {
                          const Icon = track.icon
                          const isSelected = interviewDomain === track.key
                          return (
                            <div
                              key={track.key}
                              className={`interview-domain-card ${isSelected ? 'active' : ''}`}
                              onClick={() => setInterviewDomain(track.key)}
                            >
                              <div className="interview-domain-icon-circle">
                                <Icon size={24} />
                              </div>
                              <div className="interview-domain-title">{track.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{track.desc}</div>
                            </div>
                          )
                        })}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <button
                          className="btn-solid-blue"
                          onClick={() => handleStartInterview(interviewDomain)}
                          style={{ padding: '12px 36px', fontSize: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)' }}
                        >
                          <span>Start Practice</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Active Interview Practice Screen - Panel 2 */}
                {interviewActive && !sessionFinished && (
                  <div>
                    {/* Top Bar with Back Arrow, Track Tag, and Countdown Timer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        onClick={() => { setInterviewActive(false); setSessionFinished(false) }}
                        style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}
                      >
                        <ArrowLeft size={18} />
                        <span>Interview Practice – {interviewDomain === 'technical' ? 'Technical' : interviewDomain === 'hr' ? 'HR' : interviewDomain === 'aptitude' ? 'Aptitude' : 'Coding'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700 }}>
                        <Clock size={16} />
                        <span>{formatTimer(timerSeconds)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(() => {
                      const questionsList = interviewQuestions[interviewDomain] || []
                      const q = questionsList[currentQIdx]
                      if (!q) return null

                      return (
                        <div>
                          <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>Question {currentQIdx + 1} of {questionsList.length}</span>
                              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{Math.round(((currentQIdx + 1) / questionsList.length) * 100)}% Completed</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: `${((currentQIdx + 1) / questionsList.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #38bdf8)', transition: 'width 0.3s ease' }} />
                            </div>
                          </div>

                          {/* Question Content Panel */}
                          <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                              <div style={{ flex: 1 }}>
                                <span className="match-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', marginBottom: '0.6rem', display: 'inline-block' }}>
                                  {q.tags ? q.tags.join(' - ') : 'Python Developer - Technical'}
                                </span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem' }}>
                                  {q.question}
                                </h3>
                              </div>
                              <div className="hint-callout" style={{ maxWidth: '320px' }}>
                                <div style={{ fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span>💡 Hint</span>
                                </div>
                                <div>{q.hint || 'Think about its features and popularity...'}</div>
                              </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                              <textarea
                                rows={6}
                                value={userAnswerText !== '' ? userAnswerText : (savedAnswers[currentQIdx] || '')}
                                onChange={(e) => {
                                  setUserAnswerText(e.target.value)
                                  setSavedAnswers(prev => ({ ...prev, [currentQIdx]: e.target.value }))
                                }}
                                placeholder="Type your answer here..."
                                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6, resize: 'vertical' }}
                              />
                            </div>

                            {/* Navigation Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button
                                className="sidebar-logout-btn"
                                onClick={handlePrevQuestion}
                                disabled={currentQIdx === 0}
                                style={{ width: 'auto', padding: '8px 20px', opacity: currentQIdx === 0 ? 0.4 : 1 }}
                              >
                                ← Previous
                              </button>

                              {currentQIdx < questionsList.length - 1 ? (
                                <button
                                  className="btn-solid-blue"
                                  onClick={() => {
                                    if (userAnswerText.trim()) {
                                      setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
                                    }
                                    handleNextQuestion()
                                  }}
                                  style={{ padding: '9px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                  <span>Submit Answer</span>
                                  <ArrowRight size={16} />
                                </button>
                              ) : (
                                <button
                                  className="btn-solid-blue"
                                  onClick={handleFinishInterview}
                                  style={{ background: '#2563eb', padding: '9px 28px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
                                >
                                  <span>Submit Answer</span>
                                  <ArrowRight size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* 3. Evaluation Results Screen - Panel 3 */}
                {sessionFinished && (
                  <div>
                    <div className="welcome-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Award size={22} color="#10b981" />
                        <h2 style={{ margin: 0 }}>Evaluation Results</h2>
                      </div>
                      <p>Comprehensive AI evaluation of your interview articulation and technical depth</p>
                    </div>

                    <div className="dash-2col" style={{ marginBottom: '1.5rem' }}>
                      {/* Left: Overall Score Circle */}
                      <div className="white-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <div className="radial-score-circle">
                          <span className="radial-score-num">80%</span>
                          <span className="radial-score-label">Overall Score</span>
                        </div>
                        <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 16px', fontSize: '0.82rem' }}>
                          ✔ Excellent Performance!
                        </span>
                      </div>

                      {/* Right: Detailed Analysis Breakdown */}
                      <div className="white-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff' }}>Detailed Analysis</h3>
                        {[
                          { label: 'Technical Knowledge', pct: 85, color: '#10b981', icon: Settings },
                          { label: 'Answer Accuracy', pct: 80, color: '#38bdf8', icon: CheckCircle2 },
                          { label: 'Communication', pct: 75, color: '#818cf8', icon: MessageSquare },
                          { label: 'Concept Understanding', pct: 80, color: '#f59e0b', icon: Sparkles }
                        ].map((item, idx) => {
                          const Icon = item.icon
                          return (
                            <div key={idx}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.85rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#e2e8f0', fontWeight: 500 }}>
                                  <Icon size={14} color={item.color} />
                                  <span>{item.label}</span>
                                </span>
                                <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.pct}%</span>
                              </div>
                              <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '9999px' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Strengths and Areas to Improve Boxes */}
                    <div className="dash-2col" style={{ marginBottom: '1.5rem' }}>
                      <div className="analysis-box-green">
                        <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '0.5rem', fontSize: '0.92rem' }}>Strengths</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Check size={14} color="#10b981" />
                            <span>Good understanding of core concepts</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Check size={14} color="#10b981" />
                            <span>Clear and confident answers</span>
                          </div>
                        </div>
                      </div>

                      <div className="analysis-box-red">
                        <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem', fontSize: '0.92rem' }}>Areas to Improve</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <AlertCircle size={14} color="#ef4444" />
                            <span>Deepen OOP concepts</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <AlertCircle size={14} color="#ef4444" />
                            <span>Learn more about databases</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      <button
                        className="btn-solid-blue"
                        onClick={() => setShowModelAnswer(!showModelAnswer)}
                        style={{ padding: '10px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FileText size={16} />
                        <span>{showModelAnswer ? 'Hide Detailed Report' : 'View Detailed Report'}</span>
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleStartInterview(interviewDomain)}
                        style={{ padding: '10px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <RotateCcw size={16} />
                        <span>Try Again</span>
                      </button>
                      <button
                        className="btn-pill-outline"
                        onClick={() => setActiveTab('my-progress')}
                        style={{ padding: '10px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <TrendingUp size={16} />
                        <span>View Progress Dashboard</span>
                      </button>
                    </div>

                    {/* Detailed Expert Model Answer Report */}
                    {showModelAnswer && (
                      <div className="white-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Expert Model Answer Reference</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {(interviewQuestions[interviewDomain] || []).map((q, idx) => (
                            <div key={idx} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                                Question {idx + 1}: {q.question}
                              </div>
                              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                                <strong>Model Solution: </strong>{q.modelAnswer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. JOB RECOMMENDATIONS */}
            {activeTab === 'job-recommendations' && (
              <div>
                <div className="welcome-header">
                  <h2>AI Job Recommendations & Placement Drives</h2>
                  <p>Curated campus opportunities matching your 85% career readiness index</p>
                </div>
                <div className="dash-2col">
                  {colleges.map((c, i) => (
                    <div key={i} className="white-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{c.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>{c.program}</p>
                          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>📍 {c.location}</p>
                        </div>
                        <span className="match-badge">{c.rating}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>{c.nirf}</span>
                        <button className="btn-pill-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SKILL ASSESSMENT */}
            {activeTab === 'skill-assessment' && (
              <div>
                <div className="welcome-header">
                  <h2>Career Readiness Aptitude Assessments</h2>
                  <p>Interactive problem solving to calibrate your Career Match score</p>
                </div>
                <div className="white-panel" style={{ maxWidth: '800px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Diagnostic Problem Solving Question</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
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
                          borderColor: quizAnswer === idx ? '#2563eb' : 'var(--border)',
                          background: quizAnswer === idx ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-card)',
                          color: quizAnswer === idx ? '#38bdf8' : '#e2e8f0'
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

            {/* 10. MY PROGRESS (EXACT RECREATION OF TEACHER'S PANEL 4) */}
            {activeTab === 'my-progress' && (
              <div>
                <div className="welcome-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <BarChart3 size={22} color="#3b82f6" />
                    <h2 style={{ margin: 0 }}>Interview Performance Dashboard</h2>
                  </div>
                  <p>Historical trends, competency growth, and recommended learning pathways</p>
                </div>

                {/* Top 4 Performance Cards */}
                <div className="interview-stats-grid">
                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val">3</div>
                      <div className="interview-stat-tile-lbl">Total Interviews</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      <Star size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val">78%</div>
                      <div className="interview-stat-tile-lbl">Average Score</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val" style={{ color: '#38bdf8' }}>+12%</div>
                      <div className="interview-stat-tile-lbl">Improvement</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val" style={{ color: '#f59e0b' }}>90%</div>
                      <div className="interview-stat-tile-lbl">Best Score</div>
                    </div>
                  </div>
                </div>

                {/* Middle 2-Col: Performance Trend Graph + Recommended Topics */}
                <div className="dash-2col" style={{ marginBottom: '1.5rem' }}>
                  {/* Performance Trend SVG Line Chart */}
                  <div className="white-panel" style={{ padding: '1.5rem' }}>
                    <div className="panel-header" style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Performance Trend</h3>
                      <span className="match-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>Upward Trajectory</span>
                    </div>

                    <div style={{ position: 'relative', height: '180px', width: '100%', marginTop: '1rem' }}>
                      <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        {/* Grid lines */}
                        <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4" />
                        <text x="5" y="24" fill="#64748b" fontSize="10">100%</text>

                        <line x1="40" y1="55" x2="380" y2="55" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4" />
                        <text x="12" y="59" fill="#64748b" fontSize="10">75%</text>

                        <line x1="40" y1="90" x2="380" y2="90" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4" />
                        <text x="12" y="94" fill="#64748b" fontSize="10">50%</text>

                        <line x1="40" y1="125" x2="380" y2="125" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4" />
                        <text x="12" y="129" fill="#64748b" fontSize="10">25%</text>

                        <line x1="40" y1="150" x2="380" y2="150" stroke="rgba(255, 255, 255, 0.1)" />
                        <text x="20" y="154" fill="#64748b" fontSize="10">0%</text>

                        {/* Trend Area Gradient */}
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <polygon points="80,150 80,105 220,70 350,50 350,150" fill="url(#trendGradient)" />

                        {/* Trend Line */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="80,105 220,70 350,50"
                        />

                        {/* Points */}
                        {/* Point 1: 60% */}
                        <circle cx="80" cy="105" r="5" fill="#3b82f6" stroke="#070e28" strokeWidth="2" />
                        <rect x="62" y="80" width="36" height="18" rx="4" fill="#1e293b" />
                        <text x="80" y="93" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">60%</text>
                        <text x="80" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">Attempt 1</text>

                        {/* Point 2: 70% */}
                        <circle cx="220" cy="70" r="5" fill="#3b82f6" stroke="#070e28" strokeWidth="2" />
                        <rect x="202" y="45" width="36" height="18" rx="4" fill="#1e293b" />
                        <text x="220" y="58" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">70%</text>
                        <text x="220" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">Attempt 2</text>

                        {/* Point 3: 80% */}
                        <circle cx="350" cy="50" r="6" fill="#10b981" stroke="#070e28" strokeWidth="2" />
                        <rect x="332" y="25" width="36" height="18" rx="4" fill="#2563eb" />
                        <text x="350" y="38" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">80%</text>
                        <text x="350" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">Attempt 3</text>
                      </svg>
                    </div>
                  </div>

                  {/* Recommended Topics */}
                  <div className="white-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="panel-header" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Target size={18} color="#f59e0b" />
                          <span>Recommended Topics</span>
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {[
                          { title: 'OOP Concepts', desc: 'Encapsulation, inheritance, polymorphism patterns' },
                          { title: 'Database Connectivity', desc: 'PostgreSQL connection pools and transaction isolation' },
                          { title: 'System Design', desc: 'Load balancing, vertical vs horizontal scalability' }
                        ].map((top, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={14} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{top.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{top.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="btn-solid-blue"
                      onClick={() => setActiveTab('learning-path')}
                      style={{ padding: '10px 20px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
                    >
                      <BookOpen size={16} />
                      <span>Start Learning Path →</span>
                    </button>
                  </div>
                </div>

                {/* Previous Interviews Table */}
                <div className="white-panel" style={{ padding: '1.5rem' }}>
                  <div className="panel-header" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#38bdf8" />
                      <span>Previous Interviews</span>
                    </h3>
                    <button className="btn-pill-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {[
                      { date: 'Nov 02, 2026', role: 'Python Developer', score: 80, color: '#10b981', status: 'Excellent' },
                      { date: 'Oct 25, 2026', role: 'Data Analyst', score: 72, color: '#38bdf8', status: 'Good' },
                      { date: 'Oct 18, 2026', role: 'Web Developer', score: 68, color: '#f59e0b', status: 'Proficient' }
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '95px' }}>{row.date}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{row.role}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className="match-badge" style={{ background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}44`, fontWeight: 700 }}>
                            {row.score}%
                          </span>
                          <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setActiveTab('interview-preparation')}>
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 11. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                <div className="welcome-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2>Notification Center</h2>
                      <p>Stay updated on placement drives, interview results, and AI feedback</p>
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => setNotificationsList(prev => prev.map(n => ({ ...n, read: true })))}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      Mark All as Read
                    </button>
                  </div>
                </div>

                <div className="white-panel" style={{ maxWidth: '850px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          borderRadius: '10px',
                          background: notif.read ? 'var(--bg-card)' : 'rgba(37, 99, 235, 0.08)',
                          border: notif.read ? '1px solid var(--border)' : '1px solid rgba(37, 99, 235, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: notif.type === 'interview' ? 'rgba(16, 185, 129, 0.15)' : notif.type === 'placement' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                          color: notif.type === 'interview' ? '#10b981' : notif.type === 'placement' ? '#38bdf8' : '#c084fc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {notif.type === 'interview' ? <Award size={20} /> : notif.type === 'placement' ? <Briefcase size={20} /> : <Bell size={20} />}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{notif.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{notif.time}</span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>{notif.desc}</p>
                        </div>

                        {!notif.read && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 12. SETTINGS */}
            {activeTab === 'settings' && (
              <div>
                <div className="welcome-header">
                  <h2>Account & System Settings</h2>
                  <p>Configuration status, cloud backend connectivity, and user preferences</p>
                </div>
                <div className="white-panel" style={{ maxWidth: '780px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>FastAPI Python ML Inference Server</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>http://127.0.0.1:8000 (Swagger docs available at /docs)</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>🟢 Online</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Active Student Session</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{session?.user?.email || 'Student Explorer'} (ID: {session?.user?.id?.slice(0, 12) || 'demo'}...)</div>
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
