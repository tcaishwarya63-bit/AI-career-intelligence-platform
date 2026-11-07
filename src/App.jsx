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

  // Interactive Skill Assessment State
  const [selectedAssessmentCategory, setSelectedAssessmentCategory] = useState('python')
  const [assessmentStep, setAssessmentStep] = useState('selector') // 'selector' | 'quiz' | 'result'
  const [currentAssessQIdx, setCurrentAssessQIdx] = useState(0)
  const [assessUserAnswers, setAssessUserAnswers] = useState({})
  const [assessTimeLeft, setAssessTimeLeft] = useState(300) // 5 mins
  const [assessTimerActive, setAssessTimerActive] = useState(false)
  const [lastAssessResult, setLastAssessResult] = useState(null)

  // Verified Badges Earned by Student
  const [verifiedBadges, setVerifiedBadges] = useState([
    {
      id: 'badge-py',
      category: 'python',
      title: 'Python Mastery',
      level: 'Advanced',
      score: 95,
      date: 'Oct 2026',
      badgeColor: '#38bdf8',
      icon: '🐍',
      verifiedHash: 'CC-PY-98421',
      skills: ['Functions', 'OOP', 'Decorators', 'Generators']
    },
    {
      id: 'badge-sql',
      category: 'sql',
      title: 'SQL & Database Design',
      level: 'Intermediate',
      score: 90,
      date: 'Nov 2026',
      badgeColor: '#10b981',
      icon: '🗄️',
      verifiedHash: 'CC-SQL-77312',
      skills: ['JOINs', 'Indexing', 'Aggregations', 'ACID']
    }
  ])

  // Comprehensive Question Bank for Skill Assessments
  const assessmentCategories = {
    python: {
      id: 'python',
      title: 'Python Core & Advanced',
      icon: '🐍',
      color: '#38bdf8',
      description: 'Language syntax, OOP, closures, generators & data structures',
      questionsCount: 5,
      duration: '5 Mins',
      passingScore: 70,
      questions: [
        {
          id: 1,
          q: "What is the output of `bool([])` and `bool([False])` in Python?",
          options: [
            "False and True",
            "False and False",
            "True and True",
            "True and False"
          ],
          correct: 0,
          explanation: "An empty list is falsy in Python, whereas a non-empty list `[False]` has a length of 1 and evaluates to True."
        },
        {
          id: 2,
          q: "Which built-in Python module is used to preserve function metadata in decorators?",
          options: [
            "sys",
            "functools (via @functools.wraps)",
            "inspect",
            "typing"
          ],
          correct: 1,
          explanation: "`@functools.wraps` copies over docstrings, function names, and argument signatures from original to wrapped functions."
        },
        {
          id: 3,
          q: "What does Python's GIL (Global Interpreter Lock) specifically prevent?",
          options: [
            "Multiple processes from running concurrently",
            "Multiple native threads from executing Python bytecode simultaneously",
            "Asynchronous event loops from polling sockets",
            "Garbage collection of cyclic references"
          ],
          correct: 1,
          explanation: "The GIL ensures only one native OS thread executes CPython bytecode at any given instant."
        },
        {
          id: 4,
          q: "What is the average time complexity of dictionary key lookup in Python?",
          options: [
            "O(log N)",
            "O(1)",
            "O(N)",
            "O(N log N)"
          ],
          correct: 1,
          explanation: "Python dictionaries use hash tables with open addressing, giving O(1) average lookup."
        },
        {
          id: 5,
          q: "Which keyword is used to create a generator function in Python that produces a lazy iterator stream?",
          options: [
            "return",
            "yield",
            "await",
            "emit"
          ],
          correct: 1,
          explanation: "`yield` pauses the function state and yields the next value on demand, saving memory."
        }
      ]
    },
    sql: {
      id: 'sql',
      title: 'SQL, RDBMS & Indexing',
      icon: '🗄️',
      color: '#10b981',
      description: 'Relational design, JOIN mechanics, B-Tree indices & ACID transactions',
      questionsCount: 5,
      duration: '5 Mins',
      passingScore: 70,
      questions: [
        {
          id: 1,
          q: "Which SQL JOIN returns all rows from the left table, and matched rows from the right table (with NULLs for unmatched)?",
          options: [
            "INNER JOIN",
            "LEFT OUTER JOIN",
            "FULL OUTER JOIN",
            "CROSS JOIN"
          ],
          correct: 1,
          explanation: "LEFT OUTER JOIN preserves every row from the left table regardless of whether a matching record exists on the right."
        },
        {
          id: 2,
          q: "In ACID transaction properties, what does 'Atomicity' guarantee?",
          options: [
            "Transactions execute at the speed of light",
            "All operations within the transaction succeed completely or all are rolled back",
            "Data is replicated across at least three physical storage nodes",
            "No two users can query the table simultaneously"
          ],
          correct: 1,
          explanation: "Atomicity ensures 'all-or-nothing' execution — partial commits never leave the database corrupted."
        },
        {
          id: 3,
          q: "What data structure do PostgreSQL and MySQL InnoDB predominantly use for default table indices?",
          options: [
            "Binary Search Tree",
            "B-Tree / B+ Tree",
            "Hash Table",
            "Trie"
          ],
          correct: 1,
          explanation: "B-Trees keep data sorted and allow logarithmic O(log N) searches, sequential scans, and range queries on disk."
        },
        {
          id: 4,
          q: "Which SQL clause is used to filter aggregated grouped data produced by GROUP BY?",
          options: [
            "WHERE",
            "HAVING",
            "ORDER BY",
            "LIMIT"
          ],
          correct: 1,
          explanation: "`WHERE` filters row records before grouping; `HAVING` filters aggregated values after grouping."
        },
        {
          id: 5,
          q: "What is a major downside of adding too many indexes on a database table?",
          options: [
            "Slows down SELECT queries",
            "Degrades write performance (INSERT/UPDATE/DELETE) due to index rebalancing",
            "Prevents primary key generation",
            "Forces table locks on simple read queries"
          ],
          correct: 1,
          explanation: "Every write operation must update all corresponding index trees, generating extra disk I/O and Write-Ahead Logging overhead."
        }
      ]
    },
    dsa: {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: '⚡',
      color: '#c084fc',
      description: 'Arrays, Trees, Graphs, Sorting, Dynamic Programming & Complexity',
      questionsCount: 5,
      duration: '5 Mins',
      passingScore: 70,
      questions: [
        {
          id: 1,
          q: "What is the worst-case time complexity of QuickSort when the pivot is always the smallest/largest element?",
          options: [
            "O(N log N)",
            "O(N²)",
            "O(N)",
            "O(log N)"
          ],
          correct: 1,
          explanation: "When partitions are severely unbalanced (e.g. sorted array with first element as pivot), QuickSort degrades to O(N²)."
        },
        {
          id: 2,
          q: "Which data structure is fundamentally used in Breadth-First Search (BFS) graph traversal?",
          options: [
            "Stack (LIFO)",
            "Queue (FIFO)",
            "Max-Heap",
            "Priority Tree"
          ],
          correct: 1,
          explanation: "BFS explores nodes level by level in First-In-First-Out order using a Queue."
        },
        {
          id: 3,
          q: "In an array of N integers, how can Two Sum be solved in optimal O(N) time?",
          options: [
            "Nested loops comparing every pair",
            "Single pass using a Hash Map to store target complements",
            "Binary search on unsorted elements",
            "Divide and conquer recursion"
          ],
          correct: 1,
          explanation: "A Hash Map stores `complement = target - num` with its index, enabling O(1) checks during a single pass."
        },
        {
          id: 4,
          q: "What is the time complexity to search an item in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
          options: [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
          ],
          correct: 1,
          explanation: "Self-balancing binary trees maintain height H = O(log N), guaranteeing logarithmic search time."
        },
        {
          id: 5,
          q: "Which algorithmic paradigm breaks a problem into overlapping subproblems and stores results in a lookup table?",
          options: [
            "Greedy Algorithm",
            "Dynamic Programming (Memoization / Tabulation)",
            "Brute Force Backtracking",
            "Divide and Conquer without state cache"
          ],
          correct: 1,
          explanation: "Dynamic programming caches overlapping subproblem solutions to prevent exponential recomputations."
        }
      ]
    },
    ml: {
      id: 'ml',
      title: 'Machine Learning & AI',
      icon: '🤖',
      color: '#f59e0b',
      description: 'Supervised Learning, Loss Functions, Model Metrics, Neural Nets & Transformers',
      questionsCount: 5,
      duration: '5 Mins',
      passingScore: 70,
      questions: [
        {
          id: 1,
          q: "In an imbalanced dataset where 99% of cases are negative, why is standard Accuracy misleading?",
          options: [
            "Because Accuracy cannot be represented as a percentage",
            "A naive model predicting all negatives scores 99% accuracy while detecting zero positives",
            "Loss functions do not compute on imbalanced classes",
            "Gradient descent diverges on negative samples"
          ],
          correct: 1,
          explanation: "The 'Accuracy Paradox': evaluating Macro F1-score or PR-AUC gives a true metric of predictive capability."
        },
        {
          id: 2,
          q: "Which technique is commonly used to prevent overfitting in deep neural networks by randomly deactivating neurons?",
          options: [
            "Batch Normalization",
            "Dropout",
            "Data Augmentation",
            "Gradient Clipping"
          ],
          correct: 1,
          explanation: "Dropout randomly sets a fraction of input units to 0 at each update, preventing co-adaptation of features."
        },
        {
          id: 3,
          q: "What is the core mathematical mechanism that allows Transformers to process all tokens in parallel instead of sequentially like LSTMs?",
          options: [
            "Convolutional Kernels",
            "Multi-Head Self-Attention (Query, Key, Value matrices)",
            "Backpropagation through time (BPTT)",
            "Recurrent hidden state transitions"
          ],
          correct: 1,
          explanation: "Multi-Head Self-Attention computes pairwise token representations simultaneously across matrix multiplications."
        },
        {
          id: 4,
          q: "Why does feature scaling (MinMaxScaler / StandardScaler) matter for Logistic Regression and SVMs but NOT for Decision Trees?",
          options: [
            "Decision Trees do not use numerical features",
            "Decision trees split each feature independently based on monotonic thresholds",
            "Logistic Regression has fewer parameters than trees",
            "SVMs only accept integers"
          ],
          correct: 1,
          explanation: "Tree splits depend solely on the relative order of values along a single feature dimension, invariant to linear scaling."
        },
        {
          id: 5,
          q: "What does the term 'Concept Drift' refer to in a production ML deployment?",
          options: [
            "The training server running out of memory",
            "The statistical relationship between input features and target labels P(Y|X) changes over time",
            "The API response format changing from JSON to XML",
            "Hyperparameters getting wiped after reboot"
          ],
          correct: 1,
          explanation: "Concept drift occurs when real-world patterns evolve, making previously trained weights obsolete."
        }
      ]
    },
    cloud: {
      id: 'cloud',
      title: 'Cloud & DevOps Architecture',
      icon: '☁️',
      color: '#06b6d4',
      description: 'Docker, Kubernetes, CI/CD Pipelines, Microservices & Infrastructure',
      questionsCount: 5,
      duration: '5 Mins',
      passingScore: 70,
      questions: [
        {
          id: 1,
          q: "What is the key architectural difference between Docker containers and Virtual Machines (VMs)?",
          options: [
            "Containers virtualize the hardware; VMs virtualize the browser",
            "Containers share the host OS kernel via namespaces/cgroups; VMs run a full guest OS on a hypervisor",
            "Containers only run Python applications; VMs run any language",
            "VMs launch in milliseconds; containers take minutes"
          ],
          correct: 1,
          explanation: "Containers are lightweight OS-level isolation primitives sharing one kernel; VMs require a complete virtualized hardware stack."
        },
        {
          id: 2,
          q: "In Kubernetes, what is the smallest deployable computing unit?",
          options: [
            "Cluster",
            "Pod",
            "ReplicaSet",
            "Deployment"
          ],
          correct: 1,
          explanation: "A Pod encapsulates one or more containers sharing storage and network namespaces."
        },
        {
          id: 3,
          q: "Which deployment strategy routes a small percentage (e.g. 5%) of live production traffic to a new version to test stability?",
          options: [
            "Blue-Green Deployment",
            "Canary Deployment",
            "Rolling In-Place Upgrade",
            "Recreate Deployment"
          ],
          correct: 1,
          explanation: "Canary deployments expose a small subset of real user traffic to the release before 100% rollout."
        },
        {
          id: 4,
          q: "Why is Terraform called 'declarative' Infrastructure as Code (IaC)?",
          options: [
            "You write step-by-step shell commands to create each server",
            "You define the desired target state and Terraform automatically figures out the actions to achieve it",
            "It only supports AWS cloud resources",
            "It executes only on developer laptops without state files"
          ],
          correct: 1,
          explanation: "Declarative IaC specifies the end result (e.g. '3 EC2 instances'); the engine computes the execution plan."
        },
        {
          id: 5,
          q: "What is the primary function of a reverse proxy like NGINX in microservices architecture?",
          options: [
            "Storing customer passwords in plaintext",
            "Routing external requests, load balancing, SSL termination, and API rate limiting",
            "Compiling TypeScript code at runtime",
            "Managing relational database transaction logs"
          ],
          correct: 1,
          explanation: "NGINX serves as an edge gateway managing traffic distribution, SSL certificates, and security policies."
        }
      ]
    }
  }


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
  const [sessionQuestions, setSessionQuestions] = useState([]) // shuffled 5-question subset per session
  const [showReviewPanel, setShowReviewPanel] = useState(false) // pre-submit review overview
  const [quizDifficulty, setQuizDifficulty] = useState('mixed') // 'easy' | 'medium' | 'hard' | 'mixed'
  const [quizQuestionCount, setQuizQuestionCount] = useState(20) // 20 to 40

  // Interview history — grows each time a session is finished
  const [interviewHistory, setInterviewHistory] = useState([
    { date: 'Oct 18, 2026', domain: 'Technical Interview', score: 68, color: '#f59e0b', status: 'Proficient' },
    { date: 'Oct 25, 2026', domain: 'HR Interview',        score: 72, color: '#38bdf8', status: 'Good' },
    { date: 'Nov 02, 2026', domain: 'Technical Interview', score: 80, color: '#10b981', status: 'Excellent' }
  ])

  // Notification Center State: Curated Job Recommendations & Placements
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'Job Match Alert (94% Fit): Google',
      role: 'Machine Learning Engineer',
      company: 'Google',
      desc: 'Based on your verified skills in Python, PyTorch & MLOps, your profile ranks in the top 5% of candidates. Package: ₹28,00,000 - ₹38,00,000 / yr.',
      location: 'Bangalore, India (Hybrid)',
      fit: '94% Match',
      fitColor: '#10b981',
      time: '15 minutes ago',
      type: 'job',
      read: false
    },
    {
      id: 2,
      title: 'Campus Hiring Drive (89% Fit): Microsoft',
      role: 'Senior Backend Developer',
      company: 'Microsoft',
      desc: 'Microsoft Azure Core engineering team opened campus applications for 2025/2026 Batch. Matches your Distributed Systems and Docker profile. Package: ₹24–34 LPA.',
      location: 'Hyderabad, India (On-site)',
      fit: '89% Match',
      fitColor: '#2563eb',
      time: '2 hours ago',
      type: 'job',
      read: false
    },
    {
      id: 3,
      title: 'New Opportunity (85% Fit): Amazon AWS',
      role: 'Cloud Solutions Architect',
      company: 'Amazon AWS',
      desc: 'High-priority recommendation: Multi-region cloud infrastructure & zero-downtime deployment team in Mumbai. Package: ₹22,00,000 - ₹30,00,000 / yr.',
      location: 'Mumbai, India (Hybrid)',
      fit: '85% Match',
      fitColor: '#6366f1',
      time: '5 hours ago',
      type: 'job',
      read: false
    },
    {
      id: 4,
      title: 'Shortlist Invitation (88% Fit): Flipkart',
      role: 'Lead Data Analyst',
      company: 'Flipkart',
      desc: 'E-commerce logistics & customer analytics group shortlisted your profile based on SQL, Statistics & Tableau diagnostic marks. Package: ₹18–25 LPA.',
      location: 'Bangalore, India (On-site)',
      fit: '88% Match',
      fitColor: '#10b981',
      time: 'Yesterday',
      type: 'job',
      read: false
    },
    {
      id: 5,
      title: 'Frontier AI Role (82% Fit): Meta',
      role: 'AI Research Associate',
      company: 'Meta',
      desc: 'Applied AI research opening for multimodal LLMs & PyTorch architecture optimization. Direct referral link available. Package: ₹20–28 LPA.',
      location: 'Remote (India)',
      fit: '82% Match',
      fitColor: '#ec4899',
      time: '2 days ago',
      type: 'job',
      read: true
    },
    {
      id: 6,
      title: 'Urgent Referral (81% Fit): Zomato',
      role: 'Technical Product Manager',
      company: 'Zomato',
      desc: 'Logistics technology & routing algorithm squad is hiring PMs with algorithmic problem-solving background. Package: ₹22–32 LPA.',
      location: 'Gurgaon, India (Hybrid)',
      fit: '81% Match',
      fitColor: '#f59e0b',
      time: '3 days ago',
      type: 'job',
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

  // Reset interview state whenever user navigates to the Interview Preparation tab
  useEffect(() => {
    if (activeTab === 'interview-preparation') {
      setInterviewActive(false)
      setSessionFinished(false)
      setSessionQuestions([])
      setUserAnswerText('')
      setSavedAnswers({})
      setEvaluationResults({})
      setTimerRunning(false)
      setTimerSeconds(285)
      setCurrentQIdx(0)
      setShowModelAnswer(false)
      setIsEvaluating(false)
    }
  }, [activeTab])

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

  // Career Comparison State (PDF Page 6)
  const [compareRoleA, setCompareRoleA] = useState('Data Scientist')
  const [compareRoleB, setCompareRoleB] = useState('Product Manager')

  // Export Career Insights as CSV (PDF Page 2, 3, 6)
  const handleExportCSV = () => {
    const csvRows = [
      ['CareerCast AI Recommendations Report', 'Generated on: ' + new Date().toLocaleDateString()],
      ['Rank', 'Target Role', 'Predicted Confidence', 'Macro F1 Benchmark', 'Market Demand Signal', 'Skill Alignment'],
      ['1', 'Machine Learning Engineer', '94%', '0.82', 'High Demand', '78%'],
      ['2', 'Data Scientist', '89%', '0.80', 'High Demand', '85%'],
      ['3', 'Backend Developer', '85%', '0.78', 'Moderate', '82%'],
      ['4', 'Product Manager', '81%', '0.76', 'Moderate', '70%'],
      ['5', 'AI Researcher', '78%', '0.75', 'High Demand', '74%'],
      [],
      ['Comparative Metrics (Data Scientist vs Product Manager)'],
      ['Dimension', 'Data Scientist', 'Product Manager'],
      ['Coding & Algorithms', '85%', '40%'],
      ['Statistics & Math', '92%', '50%'],
      ['Business Acumen', '55%', '90%'],
      ['Communication & Stakeholder', '65%', '95%']
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(r => r.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'careercast_career_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
  // SESSION_SIZE: show all 20 questions per session, shuffled into a different random order each time
  const SESSION_SIZE = 20

  // Fisher-Yates shuffle utility
  const shuffleArray = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const interviewQuestions = {
    // ─────────────────────────── TECHNICAL (20 Qs) ───────────────────────────
    technical: [
      {
        id: 1,
        title: "Python Fundamentals & Advantages",
        difficulty: "Fundamental",
        tags: ["Python Developer", "Technical"],
        question: "What is Python? Name any two advantages of Python over other programming languages.",
        hint: "Think about its features, readability, and ecosystem...",
        type: 'subjective',
        keywords: ["interpreted", "high-level", "dynamic typing", "readable", "extensive libraries", "cross-platform", "syntax", "advantages"],
        modelAnswer: "Python is a high-level, interpreted, general-purpose programming language designed with an emphasis on code readability. Two key advantages: 1) Clean, readable syntax that accelerates developer productivity and prototyping speed; 2) Vast ecosystem of standard and third-party libraries (NumPy, Pandas, PyTorch, FastAPI) supporting web development, machine learning, and automation."
      },
      {
        id: 2,
        title: "OOP – Four Core Principles",
        difficulty: "Intermediate",
        tags: ["OOP Concepts", "Python"],
        question: "Explain the four core principles of Object-Oriented Programming (OOP) and give an example of inheritance in Python.",
        hint: "Consider Encapsulation, Abstraction, Inheritance, and Polymorphism...",
        type: 'mcq',
        options: ["A) Encapsulation, Abstraction, Inheritance, and Polymorphism", "B) Compilation, Execution, Linking, and Loading", "C) Aggregation, Association, Composition, and Coupling", "D) Recursion, Iteration, Memoization, and Backtracking"],
        correctAnswer: "A) Encapsulation, Abstraction, Inheritance, and Polymorphism",
        keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "class", "super()", "methods"],
        modelAnswer: "The four OOP principles: 1) Encapsulation – bundling data and methods while restricting direct access; 2) Abstraction – hiding implementation details; 3) Inheritance – deriving classes from base classes to reuse code; 4) Polymorphism – objects of different classes responding to the same interface. In Python: `class Child(Parent): def __init__(self): super().__init__()`."
      },
      {
        id: 3,
        title: "Database Connectivity & ACID",
        difficulty: "Intermediate",
        tags: ["Database", "SQL"],
        question: "How does Python connect to relational databases, and why are ACID properties important for database transactions?",
        hint: "Recall psycopg2, connection pooling, commit, and rollback...",
        type: 'fillup',
        correctAnswer: "Atomicity, Consistency, Isolation, Durability",
        blankPlaceholder: "Enter the 4 ACID transaction properties (e.g. Atomicity, Consistency...)",
        keywords: ["acid", "connection pool", "commit", "rollback", "psycopg2", "sqlite3", "atomicity", "transactions"],
        modelAnswer: "Python connects using drivers like psycopg2 (PostgreSQL) or sqlite3, managed via connection pools and ORMs like SQLAlchemy. ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee that transactions either fully succeed or are fully rolled back, preventing partial data corruption."
      },
      {
        id: 4,
        title: "Horizontal vs Vertical Scaling",
        difficulty: "Intermediate",
        tags: ["System Design", "Scalability"],
        question: "What is the difference between horizontal and vertical scaling, and how does a Load Balancer distribute traffic?",
        hint: "Think about adding more machines vs upgrading one machine...",
        type: 'problem',
        starterCode: "class RoundRobinLoadBalancer:\n    def __init__(self, servers):\n        self.servers = servers\n        self.index = 0\n\n    def get_server(self):\n        # Return next server in round robin rotation\n        if not self.servers: return None\n        server = self.servers[self.index % len(self.servers)]\n        self.index += 1\n        return server",
        sampleInput: "servers = ['srv1', 'srv2', 'srv3']",
        sampleOutput: "srv1, srv2, srv3, srv1 (round robin cycle)",
        constraints: "Time: O(1) per route dispatch",
        keywords: ["horizontal scaling", "vertical scaling", "scale out", "scale up", "load balancer", "round robin", "least connections"],
        modelAnswer: "Vertical scaling adds more CPU/RAM to one server (limited by hardware ceiling). Horizontal scaling adds more server instances. A Load Balancer distributes requests using Round Robin, Least Connections, or IP Hash, performing health checks to route away from failing nodes."
      },
      {
        id: 5,
        title: "HTTP Methods & Status Codes",
        difficulty: "Fundamental",
        tags: ["APIs", "HTTP"],
        question: "What are GET, POST, PUT, DELETE in RESTful APIs, and what do status codes 200, 201, 400, 404, 500 mean?",
        hint: "Review client vs server errors and idempotency...",
        type: 'mcq',
        options: ["A) 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error", "B) 200 OK, 201 Redirect, 400 Access Denied, 404 Gateway Timeout, 500 OK", "C) 200 Success, 201 Moved, 400 Unauthorized, 404 Missing, 500 Memory Limit", "D) 200 Found, 201 Created, 400 Server Error, 404 Forbidden, 500 Bad Request"],
        correctAnswer: "A) 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error",
        keywords: ["get", "post", "put", "delete", "200 ok", "201 created", "400 bad request", "404 not found", "500 internal server error"],
        modelAnswer: "GET retrieves data, POST creates resources, PUT updates idempotently, DELETE removes resources. Status codes: 200 OK (success), 201 Created (resource created), 400 Bad Request (client error), 404 Not Found (resource missing), 500 Internal Server Error (unhandled server fault)."
      },
      {
        id: 6,
        title: "Data Structures – Arrays vs Linked Lists",
        difficulty: "Fundamental",
        tags: ["Data Structures", "CS Fundamentals"],
        question: "Compare arrays and linked lists in terms of time complexity for access, insertion, and deletion operations.",
        hint: "Think about memory layout, indexing, and pointer overhead...",
        type: 'fillup',
        correctAnswer: "O(1) vs O(N)",
        blankPlaceholder: "Enter random index access time for Array vs Linked List (e.g. O(1) vs O(N))",
        keywords: ["o(1) access", "o(n) insertion", "linked list", "pointer", "dynamic size", "cache locality", "contiguous memory"],
        modelAnswer: "Arrays: O(1) random access (index arithmetic), O(N) insertion/deletion (shifting). Linked Lists: O(N) access (pointer traversal), O(1) insertion/deletion at known node. Arrays have better cache locality due to contiguous memory; linked lists have dynamic size without reallocation."
      },
      {
        id: 7,
        title: "SQL Joins Explained",
        difficulty: "Intermediate",
        tags: ["SQL", "Database"],
        question: "Explain INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with practical examples.",
        hint: "Think in terms of matching and unmatched rows between two tables...",
        type: 'mcq',
        options: ["A) INNER JOIN matches both tables; LEFT JOIN includes all left rows plus matching right rows", "B) LEFT JOIN returns only rows that are completely NULL in left table", "C) FULL OUTER JOIN drops all unmatched records from both tables", "D) RIGHT JOIN excludes any matching keys from left table"],
        correctAnswer: "A) INNER JOIN matches both tables; LEFT JOIN includes all left rows plus matching right rows",
        keywords: ["inner join", "left join", "right join", "full outer join", "matching rows", "null", "set intersection"],
        modelAnswer: "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table plus matches from the right (NULLs for no match). RIGHT JOIN is the mirror image. FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match on either side."
      },
      {
        id: 8,
        title: "Recursion & Stack Memory",
        difficulty: "Intermediate",
        tags: ["Algorithms", "CS Fundamentals"],
        question: "What is recursion, how does the call stack work, and what causes a stack overflow in recursive functions?",
        hint: "Think about base case, stack frames, and depth...",
        type: 'problem',
        starterCode: "def factorial_recursive(n):\n    # Implement recursive factorial with guard against negative input\n    if n < 0: raise ValueError('Must be >= 0')\n    if n <= 1: return 1\n    return n * factorial_recursive(n - 1)",
        sampleInput: "factorial_recursive(5)",
        sampleOutput: "120",
        constraints: "Time: O(N), Space: O(N) call stack",
        keywords: ["base case", "recursive case", "call stack", "stack frame", "stack overflow", "depth", "tail recursion"],
        modelAnswer: "Recursion is a function calling itself with a smaller sub-problem. Each call pushes a stack frame (local variables, return address) onto the call stack. A stack overflow occurs when there is no base case or depth exceeds the system stack limit. Tail recursion optimization (TCO) can eliminate stack growth in languages that support it."
      },
      {
        id: 9,
        title: "Git Version Control",
        difficulty: "Fundamental",
        tags: ["Git", "DevTools"],
        question: "What is the difference between `git merge` and `git rebase`, and when should you use each?",
        hint: "Think about linear history vs merge commits...",
        type: 'fillup',
        correctAnswer: "git rebase",
        blankPlaceholder: "Enter git command that replays commits for linear history (e.g. git rebase)",
        keywords: ["merge commit", "fast-forward", "rebase", "linear history", "conflict", "git log", "feature branch"],
        modelAnswer: "git merge creates a merge commit preserving the full history of both branches (non-destructive). git rebase rewrites commits on top of the target branch, producing a linear clean history. Use merge for public/shared branches; use rebase for local feature cleanup before merging to avoid noisy merge commits."
      },
      {
        id: 10,
        title: "Sorting Algorithms & Complexity",
        difficulty: "Intermediate",
        tags: ["Algorithms", "CS Fundamentals"],
        question: "Compare Quick Sort, Merge Sort, and Bubble Sort in terms of time and space complexity and stability.",
        hint: "Think about average/worst case and divide-and-conquer...",
        type: 'mcq',
        options: ["A) QuickSort: O(N log N) avg, MergeSort: O(N log N) always, BubbleSort: O(N²)", "B) QuickSort: O(N²) always, MergeSort: O(1) space, BubbleSort: O(N log N)", "C) MergeSort: O(N²) worst, QuickSort: O(N) space, BubbleSort: O(1)", "D) BubbleSort: O(N log N) avg, MergeSort: O(N²), QuickSort: O(N³)"],
        correctAnswer: "A) QuickSort: O(N log N) avg, MergeSort: O(N log N) always, BubbleSort: O(N²)",
        keywords: ["quick sort", "merge sort", "bubble sort", "o(n log n)", "o(n²)", "stable sort", "in-place", "divide and conquer"],
        modelAnswer: "Quick Sort: O(N log N) average, O(N²) worst, in-place, unstable. Merge Sort: O(N log N) always, O(N) space, stable (preserves relative order of equal elements). Bubble Sort: O(N²) average and worst, in-place, stable — only suitable for nearly-sorted small datasets."
      },
      {
        id: 11,
        title: "Multithreading vs Multiprocessing",
        difficulty: "Intermediate",
        tags: ["Concurrency", "Python"],
        question: "In Python, what is the difference between multithreading and multiprocessing, and what is the GIL?",
        hint: "Think about CPU-bound vs I/O-bound tasks and the Global Interpreter Lock...",
        type: 'fillup',
        correctAnswer: "Global Interpreter Lock (GIL)",
        blankPlaceholder: "Enter lock acronym in CPython preventing simultaneous bytecode threads",
        keywords: ["gil", "global interpreter lock", "threading", "multiprocessing", "cpu-bound", "i/o-bound", "shared memory", "processes"],
        modelAnswer: "Python's Global Interpreter Lock (GIL) prevents multiple native threads from executing Python bytecode simultaneously. Threading is effective for I/O-bound tasks (network, disk) where threads release the GIL during I/O waits. Multiprocessing spawns separate OS processes each with their own Python interpreter and memory, bypassing the GIL — ideal for CPU-bound computation."
      },
      {
        id: 12,
        title: "Design Patterns – Singleton & Factory",
        difficulty: "Intermediate",
        tags: ["Design Patterns", "Software Engineering"],
        question: "Explain the Singleton and Factory design patterns with use cases in software development.",
        hint: "Think about class instantiation control and object creation abstraction...",
        type: 'problem',
        starterCode: "class DatabaseConnectionPool:\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        # Return singleton connection pool instance\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance",
        sampleInput: "p1 = DatabaseConnectionPool(); p2 = DatabaseConnectionPool()",
        sampleOutput: "p1 is p2 => True",
        constraints: "Single memory allocation across entire runtime",
        keywords: ["singleton", "factory", "instance", "creational pattern", "thread-safe", "abstract factory", "dependency injection"],
        modelAnswer: "Singleton ensures only one instance of a class exists (e.g., database connection pool, config manager) — implemented with a class-level `_instance` check. Factory Pattern abstracts object creation, returning different subclass instances based on input without exposing concrete classes to the caller, promoting loose coupling."
      },
      {
        id: 13,
        title: "Hashing & Hash Collisions",
        difficulty: "Intermediate",
        tags: ["Data Structures", "Algorithms"],
        question: "How do hash tables work, and what techniques are used to handle hash collisions?",
        hint: "Think about hash functions, chaining, and open addressing...",
        type: 'mcq',
        options: ["A) Separate Chaining (linked lists) and Open Addressing (linear/quadratic probing)", "B) QuickSort partitioning and binary search tree rebalancing", "C) Round robin queueing and Dijkstra priority heaps", "D) In-memory LRU caching and bloom filters only"],
        correctAnswer: "A) Separate Chaining (linked lists) and Open Addressing (linear/quadratic probing)",
        keywords: ["hash function", "collision", "chaining", "open addressing", "linear probing", "load factor", "o(1) average"],
        modelAnswer: "Hash tables map keys to indices via a hash function, achieving O(1) average-case lookup. Collisions occur when two keys hash to the same index. Resolution techniques: 1) Chaining – store a linked list at each bucket; 2) Open Addressing – probe the next available slot (linear probing, quadratic probing, double hashing). Load factor (entries/buckets) is maintained below 0.75 by resizing."
      },
      {
        id: 14,
        title: "Memory Management & Garbage Collection",
        difficulty: "Advanced",
        tags: ["Python Internals", "Memory"],
        question: "How does Python manage memory, and how does its garbage collector handle reference cycles?",
        hint: "Think about reference counting and cyclic garbage collector...",
        type: 'fillup',
        correctAnswer: "reference counting",
        blankPlaceholder: "Enter Python's primary memory management counting mechanism",
        keywords: ["reference counting", "garbage collector", "cyclic reference", "gc module", "heap", "memory leak", "refcount"],
        modelAnswer: "Python primarily uses reference counting: each object tracks how many references point to it; when refcount hits 0, memory is freed immediately. However, reference cycles (A→B→A) prevent refcount from reaching 0, so Python's cyclic garbage collector (gc module) uses generational collection to detect and collect these cycles."
      },
      {
        id: 15,
        title: "Decorators in Python",
        difficulty: "Intermediate",
        tags: ["Python", "Functional Programming"],
        question: "What is a decorator in Python and how does it work internally? Give a practical example.",
        hint: "Think about higher-order functions and function wrapping...",
        type: 'problem',
        starterCode: "from functools import wraps\n\ndef performance_logger(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        # Execute function while preserving original docstring and name\n        return func(*args, **kwargs)\n    return wrapper",
        sampleInput: "@performance_logger\ndef calculate(x): return x ** 2",
        sampleOutput: "calculate(4) => 16",
        constraints: "Must preserve __name__ and __doc__ via @wraps",
        keywords: ["decorator", "wrapper", "higher-order function", "functools.wraps", "closure", "@ syntax", "metadata"],
        modelAnswer: "A decorator is a higher-order function that takes a function and returns a modified version. Using @decorator syntax, Python calls `original_func = decorator(original_func)` automatically. Internally it uses closures. Best practice: use `@functools.wraps(func)` to preserve the original function's `__name__` and `__doc__` metadata."
      },
      {
        id: 16,
        title: "Networking – TCP vs UDP",
        difficulty: "Fundamental",
        tags: ["Networking", "CS Fundamentals"],
        question: "What is the difference between TCP and UDP protocols? Give two use cases for each.",
        hint: "Think about reliability, ordering, and handshake overhead...",
        type: 'mcq',
        options: ["A) TCP is connection-oriented reliable with 3-way handshake; UDP is connectionless low-latency", "B) UDP provides guaranteed delivery and packet ordering; TCP drops packets", "C) TCP is stateless; UDP is stateful with sequence numbers", "D) TCP has zero overhead; UDP requires 4-way acknowledgement handshakes"],
        correctAnswer: "A) TCP is connection-oriented reliable with 3-way handshake; UDP is connectionless low-latency",
        keywords: ["tcp", "udp", "three-way handshake", "reliable", "ordered", "connectionless", "latency", "streaming"],
        modelAnswer: "TCP (Transmission Control Protocol) is connection-oriented with guaranteed delivery, ordering, and error correction via three-way handshake — used for HTTP/HTTPS, emails, file transfers. UDP (User Datagram Protocol) is connectionless with no delivery guarantee but minimal latency — used for live video streaming, online gaming, VoIP, DNS queries."
      },
      {
        id: 17,
        title: "Big O Notation",
        difficulty: "Fundamental",
        tags: ["Algorithms", "CS Fundamentals"],
        question: "Explain O(1), O(log N), O(N), O(N log N), and O(N²) with one real-world algorithm example for each.",
        hint: "Think about how operations scale with input size...",
        type: 'fillup',
        correctAnswer: "O(log N)",
        blankPlaceholder: "Enter time complexity of binary search on sorted array (e.g. O(log N))",
        keywords: ["o(1)", "o(log n)", "o(n)", "o(n log n)", "o(n²)", "constant time", "binary search", "bubble sort", "merge sort"],
        modelAnswer: "O(1): hash table lookup (constant). O(log N): binary search (halving each step). O(N): linear scan. O(N log N): Merge Sort (divide and conquer). O(N²): Bubble Sort (nested loops). Big O describes worst-case growth rate — independent of hardware or constant factors."
      },
      {
        id: 18,
        title: "REST vs Microservices Architecture",
        difficulty: "Advanced",
        tags: ["System Design", "Architecture"],
        question: "What is a microservices architecture, and how does it differ from a monolithic application in terms of deployment, fault isolation, and team scaling?",
        hint: "Think about service boundaries, independent deployments, and inter-service communication...",
        type: 'subjective',
        keywords: ["microservices", "monolith", "independent deployment", "fault isolation", "service mesh", "api gateway", "bounded context"],
        modelAnswer: "Monolithic apps bundle all features in one deployable unit — simple to develop initially but hard to scale parts independently and risky to deploy. Microservices decompose the app into independently deployable services each owning its data store. Benefits: independent scaling, fault isolation (one service failing doesn't crash others), team autonomy. Drawbacks: network latency, distributed tracing complexity, eventual consistency challenges."
      },
      {
        id: 19,
        title: "Caching Strategies",
        difficulty: "Intermediate",
        tags: ["Performance", "System Design"],
        question: "What is caching and explain the differences between Cache-Aside, Write-Through, and Write-Back strategies.",
        hint: "Think about when data is written to cache vs database...",
        type: 'mcq',
        options: ["A) Cache-Aside (lazy load on miss), Write-Through (write cache & DB), Write-Back (async DB write)", "B) Cache-Aside (write DB first), Write-Through (drop cache), Write-Back (read only)", "C) Cache-Aside (client-side), Write-Through (CDN only), Write-Back (never expires)", "D) Cache-Aside (stateless), Write-Through (filesystem only), Write-Back (memory leak)"],
        correctAnswer: "A) Cache-Aside (lazy load on miss), Write-Through (write cache & DB), Write-Back (async DB write)",
        keywords: ["cache aside", "write through", "write back", "cache miss", "ttl", "consistency", "stale data", "redis"],
        modelAnswer: "Cache-Aside: app checks cache first; on miss, fetches from DB and writes to cache (lazy loading). Write-Through: every write goes to cache and DB simultaneously (consistent, higher write latency). Write-Back (Write-Behind): writes go to cache first, DB updated asynchronously (fast writes, risk of data loss on cache failure)."
      },
      {
        id: 20,
        title: "Security – SQL Injection & Prevention",
        difficulty: "Intermediate",
        tags: ["Security", "Web Development"],
        question: "What is SQL Injection, how does it work, and what are the best practices to prevent it?",
        hint: "Think about parameterized queries, ORM, and input sanitization...",
        type: 'fillup',
        correctAnswer: "parameterized queries",
        blankPlaceholder: "Enter primary technique to prevent SQL injection in queries",
        keywords: ["sql injection", "parameterized query", "prepared statement", "orm", "input validation", "sanitization", "whitelist", "escaping"],
        modelAnswer: "SQL Injection occurs when user input is concatenated directly into SQL queries, allowing attackers to manipulate the query (e.g., `' OR 1=1 --`). Prevention: 1) Always use parameterized queries / prepared statements; 2) Use ORMs (SQLAlchemy, Hibernate) that handle escaping; 3) Validate and whitelist user input; 4) Apply least-privilege database permissions."
      }
    ],

    // ─────────────────────────── HR (20 Qs) ───────────────────────────
    hr: [
      {
        id: 1,
        title: "Conflict Resolution",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Behavioral"],
        question: "Describe a situation where you had a disagreement with a team member. How did you resolve it and what was the outcome?",
        hint: "Use the STAR framework: Situation, Task, Action, Result...",
        type: 'mcq',
        options: ["A) Schedule an objective sync, evaluate trade-offs with data, and find collaborative alignment", "B) Immediately escalate to the department manager to overrule the colleague", "C) Avoid communication and implement your preferred design independently", "D) Concede immediately without sharing engineering reasoning"],
        correctAnswer: "A) Schedule an objective sync, evaluate trade-offs with data, and find collaborative alignment",
        keywords: ["star method", "communication", "compromise", "collaboration", "resolution", "empathy", "outcome"],
        modelAnswer: "In a capstone project, my teammate and I disagreed on database choice. I scheduled a sync to objectively evaluate requirements. We chose PostgreSQL based on ACID compliance needs, documented the decision, and the project launched successfully."
      },
      {
        id: 2,
        title: "Tell Me About Yourself",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Introduction"],
        question: "Tell me about yourself and why you are interested in this role.",
        hint: "Structure: Background → Skills → Motivation for this role...",
        type: 'fillup',
        correctAnswer: "STAR",
        blankPlaceholder: "Enter 4-part behavioral interview answering framework (Situation, Task, Action, Result)",
        keywords: ["background", "skills", "motivation", "goal", "strength", "experience", "relevant"],
        modelAnswer: "Start with your educational background, highlight 2-3 relevant technical skills, mention a key project achievement, then connect your interests and career goals to the specific role. Keep it under 2 minutes and end with why this company excites you."
      },
      {
        id: 3,
        title: "Greatest Strength & Weakness",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Self-Awareness"],
        question: "What is your greatest strength and your biggest weakness? How are you working on the weakness?",
        hint: "Be honest; show self-awareness and a growth mindset...",
        type: 'fillup',
        correctAnswer: "YAGNI",
        blankPlaceholder: "Enter agile software engineering acronym for 'You Aren't Gonna Need It'",
        keywords: ["strength", "weakness", "self-awareness", "improvement", "growth mindset", "genuine", "working on"],
        modelAnswer: "Strength: Problem-solving — I enjoy breaking down complex technical challenges into manageable parts. Weakness: I sometimes over-engineer solutions. I'm actively addressing this by setting time-boxed design sessions and reviewing YAGNI ('You Aren't Gonna Need It') principles."
      },
      {
        id: 4,
        title: "Working Under Pressure",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Stress Management"],
        question: "Describe a time you worked under tight deadlines. How did you manage stress and deliver results?",
        hint: "Use STAR: prioritization, delegation, focus strategies...",
        type: 'mcq',
        options: ["A) Prioritize tasks by impact vs urgency, time-box work sprints, and communicate status proactively", "B) Work 20 hours continuously without communicating with the team", "C) Drop secondary project requirements silently to hit deadlines", "D) Request immediate deadline extensions for all pending items"],
        correctAnswer: "A) Prioritize tasks by impact vs urgency, time-box work sprints, and communicate status proactively",
        keywords: ["deadline", "prioritize", "time management", "stress", "deliver", "focus", "break down tasks"],
        modelAnswer: "During our final semester project, I had three deliverables due in one week. I created a priority matrix (impact vs urgency), time-blocked each task into 2-hour deep work sessions, and communicated daily progress updates to my team. We delivered all three on time with positive feedback."
      },
      {
        id: 5,
        title: "Leadership & Initiative",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Leadership"],
        question: "Give an example of a time you took initiative or showed leadership without being asked to.",
        hint: "Think about proactively identifying a problem and solving it...",
        type: 'subjective',
        keywords: ["initiative", "proactive", "leadership", "identify problem", "volunteered", "outcome", "impact"],
        modelAnswer: "During a hackathon, I noticed our team had no clear task assignment, causing duplicate work. Without being asked, I created a Trello board, broke down the project into 4-hour sprints, and assigned tasks by skill set. We finished 2 hours early and won second place."
      },
      {
        id: 6,
        title: "5-Year Career Goals",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Career Planning"],
        question: "Where do you see yourself in 5 years professionally?",
        hint: "Be realistic and align your answer with the company's growth...",
        type: 'fillup',
        correctAnswer: "SMART",
        blankPlaceholder: "Enter goal-setting framework acronym (Specific, Measurable, Achievable, Relevant, Time-bound)",
        keywords: ["career growth", "technical lead", "skills", "contribute", "learning", "long-term", "promotion"],
        modelAnswer: "In 5 years I aim to grow from a software engineer into a technical lead or solutions architect. I want to master distributed systems design, contribute to open-source projects, and mentor junior engineers. I see this role as a critical step in building that expertise."
      },
      {
        id: 7,
        title: "Handling Failure",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Resilience"],
        question: "Tell me about a time you failed at something. What did you learn from it?",
        hint: "Show accountability, what you learned, and how you improved...",
        type: 'mcq',
        options: ["A) Take accountability, conduct a blameless post-mortem, and implement preventative measures", "B) Attribute failure to third-party dependencies and move on", "C) Conceal the missed deadline until discovered by leadership", "D) Avoid volunteering for high-visibility projects in the future"],
        correctAnswer: "A) Take accountability, conduct a blameless post-mortem, and implement preventative measures",
        keywords: ["failure", "accountable", "lesson learned", "improvement", "resilience", "bounce back", "reflection"],
        modelAnswer: "In my first internship, I underestimated the time required for API integration testing, missing a sprint deadline. I took accountability, communicated the delay early, and completed the work in overtime. I learned to add 30% buffer to time estimates and started using test-driven development to catch issues earlier."
      },
      {
        id: 8,
        title: "Teamwork & Collaboration",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Teamwork"],
        question: "Describe a successful team project. What was your role and contribution?",
        hint: "Highlight collaboration, communication, and your specific impact...",
        type: 'fillup',
        correctAnswer: "active listening",
        blankPlaceholder: "Enter key communication technique: paying full attention and reflecting back understanding",
        keywords: ["team", "role", "collaboration", "contribution", "communication", "shared goal", "outcome"],
        modelAnswer: "In a 4-member team project building an e-commerce platform, I led the backend API development. I held daily standups, used GitHub for code reviews, and paired with the frontend team to align on API contracts. The project received the highest marks in our cohort."
      },
      {
        id: 9,
        title: "Adaptability to Change",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Adaptability"],
        question: "Describe a time when plans changed suddenly. How did you adapt?",
        hint: "Show flexibility, quick thinking, and positive attitude...",
        type: 'subjective',
        keywords: ["adaptability", "change", "flexible", "pivot", "positive attitude", "adjust", "unexpected"],
        modelAnswer: "Mid-project, our client changed the core technology stack from React to Vue.js. I spent two evenings self-studying Vue fundamentals, then ran a team knowledge-sharing session. We adapted within 3 days with minimal timeline disruption, demonstrating our team's technical flexibility."
      },
      {
        id: 10,
        title: "Why This Company",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Motivation"],
        question: "Why do you want to work for our company specifically over our competitors?",
        hint: "Show you've researched the company, its products, culture, and values...",
        type: 'mcq',
        options: ["A) Align company mission, technical stack innovations, and engineering culture with personal career aspirations", "B) Focus solely on compensation packages and remote work flexibility", "C) Mention you applied to many companies and this one responded first", "D) State that any company with developer openings is suitable"],
        correctAnswer: "A) Align company mission, technical stack innovations, and engineering culture with personal career aspirations",
        keywords: ["research", "company values", "culture", "product", "growth opportunity", "mission", "align"],
        modelAnswer: "I researched your company's work in AI-driven personalization and was impressed by your engineering blog on real-time recommendation systems. Your emphasis on continuous learning, open-source contributions, and collaborative culture aligns perfectly with my technical interests and long-term career goals."
      },
      {
        id: 11,
        title: "Handling Critical Feedback",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Growth Mindset"],
        question: "Tell me about a time you received critical feedback. How did you handle it and what changed?",
        hint: "Show you are open to feedback and took action...",
        type: 'fillup',
        correctAnswer: "growth mindset",
        blankPlaceholder: "Enter the mindset term that views abilities and intelligence as developable through effort",
        keywords: ["feedback", "criticism", "open-minded", "action", "improvement", "mentorship", "growth"],
        modelAnswer: "My professor criticized my code for lacking modularity and being difficult to maintain. Instead of being defensive, I asked for specific examples, studied clean code principles, and rewrote the module using the Single Responsibility Principle. My next submission received full marks and positive code review comments."
      },
      {
        id: 12,
        title: "Communication Skills",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Communication"],
        question: "Describe a situation where you had to explain a complex technical concept to a non-technical person.",
        hint: "Use analogies, avoid jargon, and confirm understanding...",
        type: 'subjective',
        keywords: ["simplify", "analogy", "non-technical", "clear explanation", "jargon-free", "confirm understanding", "audience"],
        modelAnswer: "I explained machine learning model overfitting to a business stakeholder by comparing it to memorizing exam answers vs. understanding concepts. Using this analogy, they immediately understood why we needed more diverse training data. They approved the data collection budget on the spot."
      },
      {
        id: 13,
        title: "Motivation & Work Ethic",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Motivation"],
        question: "What motivates you to perform your best work every day?",
        hint: "Be genuine — intrinsic vs extrinsic motivation, purpose-driven...",
        type: 'mcq',
        options: ["A) Intrinsic drive to solve challenging real-world problems and ship impactful high-quality code", "B) Desire to minimize daily work hours and complete minimum checklist items", "C) Solely relying on external pressure from managers", "D) Avoiding collaborative team reviews to complete tasks faster"],
        correctAnswer: "A) Intrinsic drive to solve challenging real-world problems and ship impactful high-quality code",
        keywords: ["motivation", "purpose", "challenge", "growth", "impact", "curiosity", "recognition"],
        modelAnswer: "I'm most motivated by solving challenging problems that have real-world impact. When I see that a feature I built helps users accomplish a goal faster or an ML model reduces decision error rates, that outcome is deeply satisfying. I also draw motivation from learning new technologies and sharing knowledge with teammates."
      },
      {
        id: 14,
        title: "Prioritization & Time Management",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Productivity"],
        question: "How do you prioritize your tasks when you have multiple projects with competing deadlines?",
        hint: "Think about frameworks like Eisenhower Matrix or MoSCoW...",
        type: 'fillup',
        correctAnswer: "Eisenhower Matrix",
        blankPlaceholder: "Enter 2x2 priority matrix tool named after a US President (Urgent vs Important)",
        keywords: ["prioritize", "eisenhower matrix", "moscow", "urgent", "important", "time-box", "deadline", "communicate"],
        modelAnswer: "I use the Eisenhower Matrix to categorize tasks by urgency and importance. High-impact, deadline-critical tasks come first. I time-box deep work sessions of 90 minutes, use daily to-do lists with 3 MITs (Most Important Tasks), and proactively communicate to stakeholders when timelines are at risk."
      },
      {
        id: 15,
        title: "Remote Work & Self-Discipline",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Remote Work"],
        question: "How do you stay productive and maintain communication when working remotely or independently?",
        hint: "Talk about tools, routines, and async communication habits...",
        type: 'subjective',
        keywords: ["remote work", "self-discipline", "async communication", "standup", "tools", "schedule", "focus"],
        modelAnswer: "I maintain a consistent daily schedule: morning standup notes in Slack, 90-minute deep work blocks, and clear task tracking on Notion or Jira. I over-communicate progress updates asynchronously and use video calls for complex design discussions to avoid ambiguity."
      },
      {
        id: 16,
        title: "Ethical Dilemma at Work",
        difficulty: "Advanced",
        tags: ["HR Interview", "Ethics"],
        question: "Describe a situation where you faced an ethical dilemma at work or in a project. What did you do?",
        hint: "Show integrity, decision-making process, and outcome...",
        type: 'mcq',
        options: ["A) Follow company whistleblowing/security compliance policies and escalate ethically to protect user data", "B) Ignore data privacy violations to preserve sprint velocity", "C) Discuss confidential system vulnerabilities on public social forums", "D) Authorize unauthorized database access if requested verbally by a peer"],
        correctAnswer: "A) Follow company whistleblowing/security compliance policies and escalate ethically to protect user data",
        keywords: ["ethics", "integrity", "transparency", "right thing", "dilemma", "values", "consequence"],
        modelAnswer: "During a project, I discovered a data privacy issue where user emails were being logged in plaintext. I could have ignored it to meet the sprint deadline, but instead I immediately reported it to my team lead, documented the security risk, and helped fix the logging middleware before deployment. Integrity over speed."
      },
      {
        id: 17,
        title: "Learning New Technologies",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Learning Agility"],
        question: "How do you keep up with rapidly evolving technology trends and learn new skills?",
        hint: "Talk about your learning habits, resources, and practice methods...",
        type: 'fillup',
        correctAnswer: "Proof of Concept (POC)",
        blankPlaceholder: "Enter term for small exploratory proof-of-concept software project",
        keywords: ["continuous learning", "online courses", "documentation", "side projects", "tech blogs", "community", "practice"],
        modelAnswer: "I dedicate 1 hour daily to learning: reading official documentation, following engineering blogs (Uber, Netflix Engineering), and completing hands-on projects. I learn by building — my GitHub has projects in React, FastAPI, and ML. I also contribute to open-source and attend local tech meetups."
      },
      {
        id: 18,
        title: "Salary Expectations",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Negotiation"],
        question: "What are your salary expectations and how did you arrive at that number?",
        hint: "Research market rates, be flexible, tie it to your skills and value...",
        type: 'subjective',
        keywords: ["market rate", "research", "glassdoor", "negotiable", "value", "skills", "flexible", "compensation"],
        modelAnswer: "Based on my research on platforms like Glassdoor and LinkedIn, the market range for this role and my skill set in [city] is ₹X–₹Y LPA. Given my hands-on experience in [relevant skills] and the value I can contribute, I'm targeting around ₹X LPA, though I'm open to discussion based on the full compensation package."
      },
      {
        id: 19,
        title: "Dealing with Difficult Teammates",
        difficulty: "Intermediate",
        tags: ["HR Interview", "Interpersonal Skills"],
        question: "Have you ever worked with a difficult colleague? How did you manage the working relationship?",
        hint: "Focus on professionalism, empathy, and constructive communication...",
        type: 'mcq',
        options: ["A) Practice empathy, focus on objective project facts rather than personality, and establish clear agreements", "B) Engage in public arguments during team standups", "C) Form cliques to exclude the colleague from technical discussions", "D) Refuse to review pull requests from that individual"],
        correctAnswer: "A) Practice empathy, focus on objective project facts rather than personality, and establish clear agreements",
        keywords: ["difficult colleague", "empathy", "professional", "one-on-one", "understanding", "compromise", "team harmony"],
        modelAnswer: "I once worked with a teammate who was unresponsive to messages. Instead of escalating, I requested a 1:1 video call to understand their perspective. I discovered they were overwhelmed with two overlapping projects. We redistributed tasks together and established clearer response-time norms. Collaboration improved significantly."
      },
      {
        id: 20,
        title: "What Makes You Unique",
        difficulty: "Fundamental",
        tags: ["HR Interview", "Self-Branding"],
        question: "What makes you uniquely qualified for this position compared to other candidates?",
        hint: "Highlight the intersection of your technical skills, soft skills, and passion...",
        type: 'subjective',
        keywords: ["unique", "differentiate", "combination", "technical skills", "soft skills", "passion", "value", "results"],
        modelAnswer: "I combine strong technical depth (ML, full-stack development, cloud deployment) with effective communication and project leadership experience. I've shipped full-stack AI products end-to-end, mentored peers, and consistently delivered under real deadlines — a combination that goes beyond textbook knowledge."
      }
    ],

    // ─────────────────────────── APTITUDE (20 Qs) ───────────────────────────
    aptitude: [
      {
        id: 1,
        title: "Work & Rate – Parallel Workers",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Work & Rate"],
        question: "A batch pipeline processes 12,000 records in 40 minutes with 2 workers. How many minutes will 6 workers take to process 36,000 records?",
        hint: "Work = Rate × Time × Workers...",
        type: 'mcq',
        options: ["A) 30 minutes", "B) 40 minutes", "C) 50 minutes", "D) 60 minutes"],
        correctAnswer: "B) 40 minutes",
        keywords: ["work rate", "parallel processing", "150 records", "900 per minute", "40 minutes"],
        modelAnswer: "One worker: 12,000 / (40 × 2) = 150 records/min. Six workers: 6 × 150 = 900 records/min. Time for 36,000 records: 36,000 / 900 = 40 minutes."
      },
      {
        id: 2,
        title: "Percentage – Profit & Loss",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Percentages"],
        question: "A product is bought for ₹800 and sold for ₹960. What is the profit percentage?",
        hint: "Profit% = (Profit / Cost Price) × 100...",
        type: 'fillup',
        correctAnswer: "20%",
        blankPlaceholder: "Enter profit percentage (e.g. 20%)",
        keywords: ["profit", "cost price", "selling price", "160", "20 percent", "percentage"],
        modelAnswer: "Profit = 960 − 800 = ₹160. Profit% = (160 / 800) × 100 = 20%."
      },
      {
        id: 3,
        title: "Speed, Distance & Time",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Speed Distance Time"],
        question: "A train 300m long passes a pole in 15 seconds. How long will it take to cross a 450m platform?",
        hint: "Speed = Distance / Time; total distance = train length + platform length...",
        type: 'mcq',
        options: ["A) 30.0 seconds", "B) 35.0 seconds", "C) 37.5 seconds", "D) 42.0 seconds"],
        correctAnswer: "C) 37.5 seconds",
        keywords: ["speed", "distance", "time", "platform", "300", "450", "750", "20 m/s", "37.5 seconds"],
        modelAnswer: "Speed = 300 / 15 = 20 m/s. Total distance to cross platform = 300 + 450 = 750m. Time = 750 / 20 = 37.5 seconds."
      },
      {
        id: 4,
        title: "Number Series",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Logical Reasoning"],
        question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
        hint: "Look at the differences between consecutive terms...",
        type: 'fillup',
        correctAnswer: "42",
        blankPlaceholder: "Enter the next number in the series 2, 6, 12, 20, 30, ?",
        keywords: ["series", "pattern", "difference", "42", "consecutive", "arithmetic progression"],
        modelAnswer: "Differences: 4, 6, 8, 10 — increasing by 2. Next difference = 12. Answer: 30 + 12 = 42."
      },
      {
        id: 5,
        title: "Probability – Coin & Dice",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Probability"],
        question: "Two fair dice are rolled. What is the probability that the sum of the outcomes is 8?",
        hint: "List all favourable outcomes and divide by total outcomes (36)...",
        type: 'mcq',
        options: ["A) 1/6", "B) 5/36", "C) 7/36", "D) 1/9"],
        correctAnswer: "B) 5/36",
        keywords: ["probability", "dice", "sum", "favorable outcomes", "36 total", "5 outcomes", "5/36"],
        modelAnswer: "Total outcomes = 6 × 6 = 36. Favourable (sum = 8): (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Probability = 5/36."
      },
      {
        id: 6,
        title: "Simple & Compound Interest",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Interest"],
        question: "What is the difference between compound interest and simple interest on ₹10,000 at 10% per annum for 2 years?",
        hint: "SI = P×R×T/100; CI = P(1+R/100)^T − P...",
        type: 'fillup',
        correctAnswer: "100",
        blankPlaceholder: "Enter difference between CI and SI in ₹ (e.g. 100)",
        keywords: ["simple interest", "compound interest", "2000", "2100", "100 difference", "10000"],
        modelAnswer: "SI = 10,000 × 10 × 2 / 100 = ₹2,000. CI = 10,000 × (1.1)² − 10,000 = 12,100 − 10,000 = ₹2,100. Difference = ₹100."
      },
      {
        id: 7,
        title: "Ratio & Proportion",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Ratio"],
        question: "A and B share profit in ratio 3:5. Total profit is ₹48,000. How much does B receive?",
        hint: "B's share = (5 / (3+5)) × Total...",
        type: 'mcq',
        options: ["A) ₹18,000", "B) ₹24,000", "C) ₹30,000", "D) ₹32,000"],
        correctAnswer: "C) ₹30,000",
        keywords: ["ratio", "proportion", "share", "30000", "18000", "48000", "5/8"],
        modelAnswer: "Total parts = 3 + 5 = 8. B's share = (5/8) × 48,000 = ₹30,000."
      },
      {
        id: 8,
        title: "Clocks & Angles",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Clocks"],
        question: "What is the angle between the hour hand and minute hand of a clock at 3:30?",
        hint: "Hour hand moves 0.5° per minute; minute hand is at 180° at 3:30...",
        type: 'fillup',
        correctAnswer: "75",
        blankPlaceholder: "Enter angle in degrees between hour and minute hand at 3:30 (e.g. 75)",
        keywords: ["clock", "angle", "hour hand", "minute hand", "75 degrees", "3:30"],
        modelAnswer: "At 3:30: Minute hand = 30 × 6 = 180°. Hour hand = (3 × 30) + (30 × 0.5) = 90 + 15 = 105°. Angle = |180 − 105| = 75°."
      },
      {
        id: 9,
        title: "Permutation vs Combination",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Combinatorics"],
        question: "In how many ways can 3 students be selected from a group of 8 for a committee (order doesn't matter)?",
        hint: "Use nCr = n! / (r! × (n-r)!)...",
        type: 'mcq',
        options: ["A) 24 ways", "B) 48 ways", "C) 56 ways", "D) 72 ways"],
        correctAnswer: "C) 56 ways",
        keywords: ["combination", "ncr", "8c3", "56 ways", "factorial", "selection"],
        modelAnswer: "C(8,3) = 8! / (3! × 5!) = (8 × 7 × 6) / (3 × 2 × 1) = 336 / 6 = 56 ways."
      },
      {
        id: 10,
        title: "Blood Relations",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Logical Reasoning"],
        question: "Pointing to a photograph, Ravi says, 'She is the daughter of my grandfather's only son.' What is the relationship of the girl to Ravi?",
        hint: "Grandfather's only son = Ravi's father...",
        type: 'mcq',
        options: ["A) Mother", "B) Aunt", "C) Sister", "D) Daughter"],
        correctAnswer: "D) Daughter",
        keywords: ["blood relation", "grandfather", "father", "sister", "cousin", "daughter"],
        modelAnswer: "Grandfather's only son = Ravi's father. The girl is the daughter of Ravi's father, so she is Ravi's sister."
      },
      {
        id: 11,
        title: "Syllogisms",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Logical Reasoning"],
        question: "All coders are engineers. Some engineers are managers. Can we conclude: Some coders are managers?",
        hint: "Draw Venn diagrams and check if the conclusion follows necessarily...",
        type: 'mcq',
        options: ["A) Yes, definitely", "B) No, definitely not", "C) Cannot be determined definitely", "D) Only if all engineers are coders"],
        correctAnswer: "C) Cannot be determined definitely",
        keywords: ["syllogism", "all", "some", "valid conclusion", "venn diagram", "not necessarily"],
        modelAnswer: "No, this conclusion does NOT necessarily follow. 'All coders are engineers' and 'some engineers are managers' doesn't guarantee any overlap between coders and managers. Some engineers who are managers may not be coders."
      },
      {
        id: 12,
        title: "Data Interpretation – Bar Chart",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Data Interpretation"],
        question: "A company's revenue: 2020=₹40L, 2021=₹60L, 2022=₹80L, 2023=₹100L. What is the average annual growth in revenue from 2020 to 2023?",
        hint: "Average growth = Total increase / Number of years...",
        type: 'fillup',
        correctAnswer: "150%",
        blankPlaceholder: "Enter total revenue growth percentage from 40L to 100L (e.g. 150%)",
        keywords: ["average", "growth", "revenue", "20 lakhs", "3 years", "per year"],
        modelAnswer: "Total increase = 100 − 40 = ₹60L over 3 years. Average annual growth = 60 / 3 = ₹20 Lakhs per year."
      },
      {
        id: 13,
        title: "Pipes & Cisterns",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Work & Rate"],
        question: "Pipe A fills a tank in 6 hours; Pipe B fills it in 4 hours. If both pipes are opened together, how long to fill the tank?",
        hint: "Combined rate = 1/A + 1/B; Time = 1 / combined rate...",
        type: 'mcq',
        options: ["A) 2.4 hours", "B) 2.8 hours", "C) 3.0 hours", "D) 3.2 hours"],
        correctAnswer: "A) 2.4 hours",
        keywords: ["pipe", "cistern", "combined rate", "12/5", "2.4 hours", "fill tank"],
        modelAnswer: "Rate A = 1/6, Rate B = 1/4. Combined = 1/6 + 1/4 = 2/12 + 3/12 = 5/12 per hour. Time = 12/5 = 2.4 hours (2 hours 24 minutes)."
      },
      {
        id: 14,
        title: "Direction Sense",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Directions"],
        question: "Starting from point A, Meera walks 5km North, then 3km East, then 5km South. How far and in what direction is she from A?",
        hint: "Track displacement in X and Y components...",
        type: 'fillup',
        correctAnswer: "5.83 km",
        blankPlaceholder: "Enter straight-line distance from point A in km (e.g. 5.83 km)",
        keywords: ["direction", "north", "east", "south", "displacement", "3km east", "3km"],
        modelAnswer: "North 5km then South 5km cancel out. Net displacement: 3km East. Meera is 3km East of point A."
      },
      {
        id: 15,
        title: "Coding-Decoding",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Logical Reasoning"],
        question: "In a code language, APPLE is written as BQQMF. How is MANGO written in the same code?",
        hint: "Notice each letter is shifted by 1 position in the alphabet...",
        type: 'fillup',
        correctAnswer: "NBOHP",
        blankPlaceholder: "Enter the coded word for MANGO (+1 shift)",
        keywords: ["coding decoding", "shift", "alphabet", "pattern", "NBOHP", "one position"],
        modelAnswer: "Each letter is shifted +1: A→B, P→Q, P→Q, L→M, E→F. Applying same to MANGO: M→N, A→B, N→O, G→H, O→P = NBOHP."
      },
      {
        id: 16,
        title: "Ages Problem",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Algebra"],
        question: "The sum of ages of father and son is 50 years. Five years ago, the father was 7 times the age of the son. Find their current ages.",
        hint: "Set up two equations with two unknowns...",
        type: 'mcq',
        options: ["A) Father 35, Son 15", "B) Father 37.5, Son 12.5", "C) Father 40, Son 10", "D) Father 42, Son 8"],
        correctAnswer: "B) Father 37.5, Son 12.5",
        keywords: ["ages", "equations", "father", "son", "40", "10", "linear equations"],
        modelAnswer: "Let son = x, father = 50−x. Five years ago: (50−x−5) = 7(x−5) → 45−x = 7x−35 → 80 = 8x → x = 10. Son = 10, Father = 40."
      },
      {
        id: 17,
        title: "LCM & HCF",
        difficulty: "Fundamental",
        tags: ["Aptitude", "Number Theory"],
        question: "Find the LCM and HCF of 12 and 18. Verify that LCM × HCF = Product of numbers.",
        hint: "Prime factorization: 12 = 2²×3, 18 = 2×3²...",
        type: 'fillup',
        correctAnswer: "36 and 6",
        blankPlaceholder: "Enter LCM and HCF of 12 and 18 (e.g. 36 and 6)",
        keywords: ["lcm", "hcf", "prime factorization", "36", "6", "product", "12 and 18"],
        modelAnswer: "12 = 2²×3, 18 = 2×3². HCF = 2¹×3¹ = 6. LCM = 2²×3² = 36. Verification: 6 × 36 = 216 = 12 × 18 ✓."
      },
      {
        id: 18,
        title: "Seating Arrangement",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Logical Reasoning"],
        question: "5 people (A, B, C, D, E) sit in a row. A sits at one end. B is to the immediate right of A. D is not adjacent to B. E sits at the other end. Where does C sit?",
        hint: "Place A and E at ends first, then apply constraints...",
        type: 'mcq',
        options: ["A) B", "B) C", "C) D", "D) E"],
        correctAnswer: "B) C",
        keywords: ["seating", "arrangement", "row", "adjacent", "position 3", "middle", "constraints"],
        modelAnswer: "A is at position 1, B at position 2. E is at position 5. D is not adjacent to B (position 2), so D is not at position 3. D must be at position 4. Therefore C is at position 3 (middle)."
      },
      {
        id: 19,
        title: "Mixtures & Alligation",
        difficulty: "Advanced",
        tags: ["Aptitude", "Mixtures"],
        question: "In what ratio should water (cost ₹0) be mixed with milk (cost ₹40/L) to get a mixture worth ₹32/L?",
        hint: "Use Alligation: (Expensive − Mean) : (Mean − Cheap)...",
        type: 'fillup',
        correctAnswer: "1:4",
        blankPlaceholder: "Enter ratio of water to milk (e.g. 1:4)",
        keywords: ["alligation", "mixture", "ratio", "1:4", "water", "milk", "mean price"],
        modelAnswer: "Using Alligation: Water side = 40−32 = 8; Milk side = 32−0 = 32. Ratio Water:Milk = 8:32 = 1:4."
      },
      {
        id: 20,
        title: "Venn Diagrams – Set Theory",
        difficulty: "Intermediate",
        tags: ["Aptitude", "Set Theory"],
        question: "In a class of 60 students, 40 like Maths, 35 like Science, and 25 like both. How many like neither?",
        hint: "Use inclusion-exclusion: |M∪S| = |M| + |S| − |M∩S|...",
        type: 'mcq',
        options: ["A) 15 students", "B) 20 students", "C) 25 students", "D) 30 students"],
        correctAnswer: "C) 25 students",
        keywords: ["venn diagram", "set theory", "inclusion exclusion", "union", "intersection", "50", "10 neither"],
        modelAnswer: "Students liking Maths or Science = 40 + 35 − 25 = 50. Students liking neither = 60 − 50 = 10."
      }
    ],

    // ─────────────────────────── CODING (20 Qs) ───────────────────────────
    coding: [
      {
        id: 1,
        title: "Two Sum – Hash Map",
        difficulty: "Easy",
        tags: ["Coding Interview", "Arrays"],
        question: "Given an array `nums` and a `target`, return indices of two numbers that add up to `target` in O(N) time.",
        hint: "Use a hash map to store complements (target − num)...",
        type: 'problem',
        starterCode: "def two_sum(nums, target):\n    # Return indices [i, j] such that nums[i] + nums[j] == target in O(N)\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i\n    return []",
        sampleInput: "nums = [2, 7, 11, 15], target = 9",
        sampleOutput: "[0, 1]",
        constraints: "Time: O(N), Space: O(N)",
        keywords: ["hash map", "dictionary", "o(n) time", "complement", "indices", "single pass"],
        modelAnswer: "Single-pass hash map: for each num at index i, check if (target − num) is in the map. If yes, return [map[target−num], i]. Else store map[num] = i. O(N) time, O(N) space."
      },
      {
        id: 2,
        title: "Reverse a String",
        difficulty: "Easy",
        tags: ["Coding Interview", "Strings"],
        question: "Write a function to reverse a string in-place without using Python's reverse() or slice notation.",
        hint: "Use two pointers — one at start, one at end, swap and move inward...",
        type: 'problem',
        starterCode: "def reverse_string(s_list):\n    # Reverse character list in-place using two pointers\n    left, right = 0, len(s_list) - 1\n    while left < right:\n        s_list[left], s_list[right] = s_list[right], s_list[left]\n        left += 1\n        right -= 1\n    return s_list",
        sampleInput: "s = ['h', 'e', 'l', 'l', 'o']",
        sampleOutput: "['o', 'l', 'l', 'e', 'h']",
        constraints: "Time: O(N), Space: O(1)",
        keywords: ["two pointers", "swap", "in-place", "iteration", "left right", "while loop"],
        modelAnswer: "Use two pointers l=0, r=len-1. While l<r: swap arr[l] and arr[r], then l++, r--. This is O(N) time, O(1) space."
      },
      {
        id: 3,
        title: "Fibonacci – Dynamic Programming",
        difficulty: "Easy",
        tags: ["Coding Interview", "DP"],
        question: "Compute the N-th Fibonacci number efficiently. What is the time complexity of the naive recursive solution vs the memoized version?",
        hint: "Naive recursion: O(2^N). Memoization / tabulation: O(N)...",
        type: 'mcq',
        options: ["A) Naive Recursion: O(2^N), Memoized/Tabulated DP: O(N)", "B) Naive Recursion: O(N), Memoized/Tabulated DP: O(1)", "C) Naive Recursion: O(N log N), Memoized/Tabulated DP: O(N²)", "D) Naive Recursion: O(N!), Memoized/Tabulated DP: O(log N)"],
        correctAnswer: "A) Naive Recursion: O(2^N), Memoized/Tabulated DP: O(N)",
        keywords: ["fibonacci", "memoization", "dynamic programming", "o(2^n)", "o(n)", "cache", "bottom-up"],
        modelAnswer: "Naive recursion recalculates subproblems exponentially → O(2^N). Memoization stores results in a dict/array → O(N) time and O(N) space. Bottom-up DP using two variables achieves O(N) time and O(1) space."
      },
      {
        id: 4,
        title: "Binary Search",
        difficulty: "Easy",
        tags: ["Coding Interview", "Searching"],
        question: "Implement binary search on a sorted array. What is its time complexity and what precondition must be met?",
        hint: "Compare mid to target; eliminate half the search space each step...",
        type: 'problem',
        starterCode: "def binary_search(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1",
        sampleInput: "nums = [1, 3, 5, 7, 9, 11], target = 7",
        sampleOutput: "3",
        constraints: "Time: O(log N), Space: O(1)",
        keywords: ["binary search", "sorted", "o(log n)", "mid", "low high", "precondition", "divide"],
        modelAnswer: "Binary search requires a sorted array. Set low=0, high=len-1. While low≤high: mid=(low+high)//2. If arr[mid]==target return mid. If arr[mid]<target, low=mid+1 else high=mid-1. Time: O(log N), Space: O(1)."
      },
      {
        id: 5,
        title: "Linked List – Reverse",
        difficulty: "Easy",
        tags: ["Coding Interview", "Linked Lists"],
        question: "Write code to reverse a singly linked list iteratively. What are the time and space complexities?",
        hint: "Track prev, curr, next pointers as you iterate...",
        type: 'problem',
        starterCode: "def reverse_linked_list(head):\n    # Reverse singly linked list iteratively with 3 pointers\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
        sampleInput: "head = 1 -> 2 -> 3 -> 4 -> 5 -> None",
        sampleOutput: "5 -> 4 -> 3 -> 2 -> 1 -> None",
        constraints: "Time: O(N), Space: O(1)",
        keywords: ["linked list", "reverse", "prev", "curr", "next", "o(n) time", "o(1) space", "iterative"],
        modelAnswer: "Initialize prev=None, curr=head. While curr: save next=curr.next, set curr.next=prev, move prev=curr and curr=next. Return prev (new head). O(N) time, O(1) space."
      },
      {
        id: 6,
        title: "Stack – Balanced Parentheses",
        difficulty: "Easy",
        tags: ["Coding Interview", "Stack"],
        question: "Given a string of brackets ({[()]}), write an algorithm to check if parentheses are balanced.",
        hint: "Use a stack — push open brackets, pop and match on close brackets...",
        type: 'problem',
        starterCode: "def is_valid_parentheses(s):\n    stack = []\n    matching = {')': '(', '}': '{', ']': '['}\n    for ch in s:\n        if ch in matching.values():\n            stack.append(ch)\n        elif ch in matching:\n            if not stack or stack.pop() != matching[ch]:\n                return False\n    return len(stack) == 0",
        sampleInput: "s = '([{}])'",
        sampleOutput: "True",
        constraints: "Time: O(N), Space: O(N)",
        keywords: ["stack", "balanced", "push", "pop", "match", "open brackets", "close brackets", "o(n)"],
        modelAnswer: "Iterate characters. If open bracket, push to stack. If close bracket, check if stack top matches. If mismatch or stack empty → unbalanced. After full iteration, stack must be empty → balanced. O(N) time, O(N) space."
      },
      {
        id: 7,
        title: "Find Duplicates in Array",
        difficulty: "Easy",
        tags: ["Coding Interview", "Arrays"],
        question: "Find all duplicate numbers in an array of N integers in O(N) time and O(1) extra space (integers range 1 to N).",
        hint: "Use index as a hash — mark visited elements by negating the value at their index...",
        type: 'fillup',
        correctAnswer: "O(N) time and O(N) space",
        blankPlaceholder: "Enter time and space complexity using a Hash Set for duplicates",
        keywords: ["duplicate", "index as hash", "negate", "o(n) time", "o(1) space", "mark visited"],
        modelAnswer: "For each num, go to index |num|-1. If value is negative, num is a duplicate. Otherwise negate the value at that index. This achieves O(N) time and O(1) extra space."
      },
      {
        id: 8,
        title: "BFS – Level Order Tree Traversal",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Trees", "BFS"],
        question: "Implement level order traversal (BFS) on a binary tree. Return nodes level by level.",
        hint: "Use a queue — enqueue root, then level by level dequeue and enqueue children...",
        type: 'problem',
        starterCode: "from collections import deque\n\ndef level_order(root):\n    # Breadth-First Search level order traversal\n    if not root: return []\n    res, queue = [], deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        res.append(level)\n    return res",
        sampleInput: "root = [3, 9, 20, None, None, 15, 7]",
        sampleOutput: "[[3], [9, 20], [15, 7]]",
        constraints: "Time: O(N), Space: O(W) where W is max tree width",
        keywords: ["bfs", "queue", "level order", "binary tree", "dequeue", "enqueue", "o(n)"],
        modelAnswer: "Use a deque. Enqueue root. While queue: get current level size, process exactly that many nodes, appending left and right children. Collect each level into result. O(N) time and O(N) space."
      },
      {
        id: 9,
        title: "DFS – Detect Cycle in Graph",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Graphs", "DFS"],
        question: "Using DFS, how do you detect a cycle in a directed graph?",
        hint: "Track visited nodes and nodes currently in the recursion stack...",
        type: 'mcq',
        options: ["A) 3-Coloring DFS: 0=White (unvisited), 1=Gray (in recursion stack), 2=Black (completed)", "B) Fast & Slow two-pointer Floyd cycle runner on adjacency matrix", "C) Dijkstra's algorithm with priority queue relaxation", "D) Prim's minimum spanning tree cut property"],
        correctAnswer: "A) 3-Coloring DFS: 0=White (unvisited), 1=Gray (in recursion stack), 2=Black (completed)",
        keywords: ["dfs", "cycle detection", "directed graph", "recursion stack", "visited", "back edge"],
        modelAnswer: "Maintain two sets: visited and rec_stack (current DFS path). During DFS, if we encounter a node already in rec_stack, a cycle exists (back edge). After returning from DFS, remove node from rec_stack. O(V+E) time."
      },
      {
        id: 10,
        title: "Dynamic Programming – Longest Common Subsequence",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "DP", "Strings"],
        question: "Given two strings, find the length of their Longest Common Subsequence (LCS). Explain the DP approach.",
        hint: "Build a 2D DP table: dp[i][j] = LCS length of s1[:i] and s2[:j]...",
        type: 'problem',
        starterCode: "def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j-1]\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]",
        sampleInput: "text1 = 'abcde', text2 = 'ace'",
        sampleOutput: "3",
        constraints: "Time: O(M*N), Space: O(M*N)",
        keywords: ["lcs", "dynamic programming", "2d table", "subsequence", "o(m*n)", "dp"],
        modelAnswer: "Create dp[m+1][n+1] initialized to 0. For each i,j: if s1[i-1]==s2[j-1], dp[i][j]=dp[i-1][j-1]+1. Else dp[i][j]=max(dp[i-1][j], dp[i][j-1]). Answer is dp[m][n]. O(M×N) time and space."
      },
      {
        id: 11,
        title: "Merge Two Sorted Arrays",
        difficulty: "Easy",
        tags: ["Coding Interview", "Arrays"],
        question: "Merge two sorted arrays into a single sorted array in O(M+N) time.",
        hint: "Use two pointers — compare and pick the smaller element from each array...",
        type: 'fillup',
        correctAnswer: "O(M+N)",
        blankPlaceholder: "Enter time complexity to merge two sorted arrays of sizes M and N",
        keywords: ["merge", "two pointers", "sorted", "o(m+n)", "compare", "append remainder"],
        modelAnswer: "Use pointer i for arr1, j for arr2. Compare arr1[i] and arr2[j], append the smaller to result and advance that pointer. After one array is exhausted, append remaining elements of the other. O(M+N) time, O(M+N) space."
      },
      {
        id: 12,
        title: "Quick Sort – Implementation",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Sorting"],
        question: "Implement Quick Sort. What is its average and worst-case time complexity and when does worst case occur?",
        hint: "Choose a pivot, partition the array around it, recursively sort sub-arrays...",
        type: 'problem',
        starterCode: "def quick_sort(arr):\n    # Divide and conquer QuickSort\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)",
        sampleInput: "arr = [38, 27, 43, 3, 9, 82, 10]",
        sampleOutput: "[3, 9, 10, 27, 38, 43, 82]",
        constraints: "Average Time: O(N log N)",
        keywords: ["quick sort", "pivot", "partition", "o(n log n) average", "o(n²) worst", "already sorted", "in-place"],
        modelAnswer: "Pick pivot (e.g., last element). Partition array: smaller elements to left, larger to right. Recursively sort both halves. Average: O(N log N). Worst case: O(N²) when array is already sorted and pivot is always min/max. Use random pivot or median-of-three to avoid worst case."
      },
      {
        id: 13,
        title: "String – Anagram Check",
        difficulty: "Easy",
        tags: ["Coding Interview", "Strings"],
        question: "Write a function to check if two strings are anagrams of each other in O(N) time.",
        hint: "Compare character frequency counts...",
        type: 'mcq',
        options: ["A) Compare character frequency maps in O(N) time and O(1) space (26 alphabet buckets)", "B) Nested double loop comparing every pair in O(N²)", "C) Check string length only without inspecting contents", "D) Calculate integer sum of ASCII ordinals without frequency counts"],
        correctAnswer: "A) Compare character frequency maps in O(N) time and O(1) space (26 alphabet buckets)",
        keywords: ["anagram", "frequency count", "counter", "o(n)", "character map", "sorted comparison"],
        modelAnswer: "Method 1: Use Counter/frequency dict — count chars in s1, subtract counts for s2, check all zero. Method 2: sort both strings and compare. Counter method: O(N) time, O(1) space (26 lowercase letters)."
      },
      {
        id: 14,
        title: "Find Maximum Subarray Sum (Kadane's Algorithm)",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "DP", "Arrays"],
        question: "Given an integer array, find the contiguous subarray with the largest sum using Kadane's Algorithm.",
        hint: "Track current sum and maximum sum as you scan left to right...",
        type: 'problem',
        starterCode: "def max_sub_array(nums):\n    # Kadane's algorithm for maximum contiguous subarray sum\n    max_so_far = current_max = nums[0]\n    for x in nums[1:]:\n        current_max = max(x, current_max + x)\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far",
        sampleInput: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        sampleOutput: "6",
        constraints: "Time: O(N), Space: O(1)",
        keywords: ["kadane", "maximum subarray", "current sum", "max sum", "o(n)", "dynamic programming"],
        modelAnswer: "Initialize max_sum = current_sum = arr[0]. For each element from index 1: current_sum = max(arr[i], current_sum + arr[i]). Update max_sum = max(max_sum, current_sum). O(N) time, O(1) space."
      },
      {
        id: 15,
        title: "Binary Tree – Height",
        difficulty: "Easy",
        tags: ["Coding Interview", "Trees"],
        question: "Write a recursive function to find the height of a binary tree.",
        hint: "Height = 1 + max(height of left subtree, height of right subtree)...",
        type: 'problem',
        starterCode: "def tree_height(root):\n    # Recursive calculation of maximum tree height / depth\n    if not root: return 0\n    return 1 + max(tree_height(root.left), tree_height(root.right))",
        sampleInput: "root = [3, 9, 20, None, None, 15, 7]",
        sampleOutput: "3",
        constraints: "Time: O(N), Space: O(H)",
        keywords: ["binary tree", "height", "depth", "recursion", "base case", "o(n)", "max left right"],
        modelAnswer: "Base case: if node is None, return 0. Recursive: return 1 + max(height(node.left), height(node.right)). O(N) time — visits every node once."
      },
      {
        id: 16,
        title: "Palindrome Check",
        difficulty: "Easy",
        tags: ["Coding Interview", "Strings"],
        question: "Write an O(N) function to check if a string is a palindrome, ignoring spaces and case.",
        hint: "Two pointers — left and right, skip non-alphanumeric chars...",
        type: 'fillup',
        correctAnswer: "O(N) time and O(1) space",
        blankPlaceholder: "Enter time and space complexity for two-pointer palindrome check",
        keywords: ["palindrome", "two pointers", "o(n)", "alphanumeric", "case insensitive", "ignore spaces"],
        modelAnswer: "Use two pointers l=0, r=len-1. Skip non-alphanumeric chars. Compare s[l].lower() == s[r].lower(). If mismatch return False. If l≥r return True. O(N) time, O(1) space."
      },
      {
        id: 17,
        title: "Matrix – Spiral Order",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Matrix"],
        question: "Given an M×N matrix, return all elements in spiral order (clockwise from top-left).",
        hint: "Maintain four boundaries: top, bottom, left, right; shrink after each pass...",
        type: 'problem',
        starterCode: "def spiral_order(matrix):\n    if not matrix: return []\n    res = []\n    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1\n    while top <= bottom and left <= right:\n        for j in range(left, right + 1): res.append(matrix[top][j])\n        top += 1\n        for i in range(top, bottom + 1): res.append(matrix[i][right])\n        right -= 1\n        if top <= bottom:\n            for j in range(right, left - 1, -1): res.append(matrix[bottom][j])\n            bottom -= 1\n        if left <= right:\n            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])\n            left += 1\n    return res",
        sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        sampleOutput: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
        constraints: "Time: O(M*N), Space: O(1)",
        keywords: ["spiral", "matrix", "top bottom left right", "boundaries", "clockwise", "o(m*n)"],
        modelAnswer: "Use top, bottom, left, right pointers. Traverse right along top row, down along right col, left along bottom row, up along left col. Shrink boundaries after each traversal. Continue while top≤bottom and left≤right. O(M×N) time."
      },
      {
        id: 18,
        title: "Top K Frequent Elements",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Heap", "Arrays"],
        question: "Given an array, return the K most frequent elements in O(N log K) time.",
        hint: "Use a frequency map and a min-heap of size K...",
        type: 'problem',
        starterCode: "import heapq\nfrom collections import Counter\n\ndef top_k_frequent(nums, k):\n    count = Counter(nums)\n    return heapq.nlargest(k, count.keys(), key=count.get)",
        sampleInput: "nums = [1, 1, 1, 2, 2, 3], k = 2",
        sampleOutput: "[1, 2]",
        constraints: "Time: O(N log K), Space: O(N)",
        keywords: ["heap", "min heap", "frequency", "counter", "o(n log k)", "top k", "priority queue"],
        modelAnswer: "Count frequencies using a dict/Counter. Use a min-heap of size K to track top K elements. For each (freq, num), push to heap; if heap size > K, pop. Final heap contains the K most frequent elements. O(N log K) time."
      },
      {
        id: 19,
        title: "Implement Queue using Stacks",
        difficulty: "Intermediate",
        tags: ["Coding Interview", "Stack", "Queue"],
        question: "Implement a Queue using two stacks. What is the amortized time complexity of enqueue and dequeue?",
        hint: "One stack for push, one for pop — transfer when second is empty...",
        type: 'mcq',
        options: ["A) Push is O(1); Pop is amortized O(1) using two stacks (in_stack and out_stack)", "B) Both Push and Pop are strictly O(N) on every operation", "C) Push is O(N log N); Pop is O(1)", "D) Pop requires O(N²) quadratic recursive shifting"],
        correctAnswer: "A) Push is O(1); Pop is amortized O(1) using two stacks (in_stack and out_stack)",
        keywords: ["queue", "two stacks", "amortized o(1)", "enqueue", "dequeue", "transfer", "amortized"],
        modelAnswer: "Stack1 for enqueue (push). Stack2 for dequeue. When dequeue is called and stack2 is empty, transfer all from stack1 to stack2 (reverses order). Pop from stack2. Enqueue: O(1). Dequeue: O(N) worst case but O(1) amortized."
      },
      {
        id: 20,
        title: "Dijkstra's Shortest Path",
        difficulty: "Advanced",
        tags: ["Coding Interview", "Graphs", "Algorithms"],
        question: "Explain Dijkstra's shortest path algorithm. What data structure makes it efficient and what is its time complexity?",
        hint: "Use a min-heap (priority queue) for greedy selection of minimum distance node...",
        type: 'fillup',
        correctAnswer: "Min-Heap or Priority Queue",
        blankPlaceholder: "Enter priority data structure used with Dijkstra to achieve O((V+E) log V)",
        keywords: ["dijkstra", "shortest path", "priority queue", "min heap", "relaxation", "o((v+e) log v)", "greedy"],
        modelAnswer: "Dijkstra finds the shortest path from source to all nodes in a weighted graph (non-negative edges). Initialize all distances as infinity, source as 0. Use a min-heap: repeatedly extract the node with minimum distance, relax its neighbors (update if shorter path found). Time: O((V+E) log V) with binary heap."
      }
    ],
    ml: [
      {
        id: 1,
        title: "Overfitting & Regularization in Deep Models",
        difficulty: "Intermediate",
        tags: ["Deep Learning", "Generalization"],
        question: "How do you detect overfitting in complex neural networks or gradient boosted decision trees, and what concrete techniques do you apply to mitigate it?",
        type: 'subjective',
        keywords: ["dropout", "early stopping", "l1", "l2", "weight decay", "cross validation", "data augmentation", "regularization", "validation loss", "learning rate"],
        modelAnswer: "Overfitting is primarily detected when validation loss begins to diverge or increase while training loss continues decreasing. To mitigate it in neural networks: 1) Apply Dropout layers (typically 0.2 to 0.5) to prevent co-adaptation of neurons; 2) Implement Early Stopping based on validation loss patience; 3) Use L2 Weight Decay to constrain parameter norms; 4) Employ Data Augmentation to increase training diversity; and 5) In Gradient Boosted Trees (like XGBoost), tune hyper-parameters such as max_depth (3–6), colsample_bytree, and min_child_weight."
      },
      {
        id: 2,
        title: "Class Imbalance & Evaluation Metrics",
        difficulty: "Intermediate",
        tags: ["Model Evaluation", "Metrics"],
        question: "In fraud detection or disease diagnosis where 99.5% of cases are negative, why is standard Accuracy misleading, and which evaluation metrics and resampling strategies should you use instead?",
        type: 'mcq',
        options: ["A) PR-AUC (Precision-Recall Area Under Curve), F1-Score, and SMOTE resampling", "B) Raw Accuracy and Mean Squared Error only", "C) R² Coefficient of Determination without class weighting", "D) Ignoring the positive minority class completely"],
        correctAnswer: "A) PR-AUC (Precision-Recall Area Under Curve), F1-Score, and SMOTE resampling",
        keywords: ["accuracy paradox", "precision", "recall", "f1", "pr-auc", "roc-auc", "smote", "oversampling", "undersampling", "class weights", "confusion matrix"],
        modelAnswer: "Standard accuracy suffers from the 'Accuracy Paradox': a naive classifier predicting everything as negative achieves 99.5% accuracy while identifying 0 fraudulent cases. Instead: 1) Evaluate Macro/Micro F1-Score to balance Precision and Recall; 2) Utilize PR-AUC (Precision-Recall Area Under Curve), which is much more informative than ROC-AUC under severe imbalance; 3) Apply Cost-Sensitive Learning / Class Weighting (e.g. scale_pos_weight in XGBoost); and 4) Use resampling techniques like SMOTE (Synthetic Minority Over-sampling) on the training set."
      },
      {
        id: 3,
        title: "Transformers vs. Recurrent Architectures (RNN/LSTM)",
        difficulty: "Advanced",
        tags: ["NLP", "Transformers"],
        question: "How does the Multi-Head Self-Attention mechanism in Transformers solve the fundamental sequential bottleneck of RNNs and LSTMs?",
        type: 'fillup',
        correctAnswer: "Multi-Head Self-Attention",
        blankPlaceholder: "Enter Transformer attention operation formula: softmax(Q * K^T / sqrt(d_k)) * V",
        keywords: ["parallelization", "self-attention", "sequential bottleneck", "vanishing gradient", "o(1) path length", "qkv", "query key value", "positional encoding"],
        modelAnswer: "RNNs and LSTMs process tokens sequentially step-by-step (token t depends on hidden state t-1), prohibiting GPU parallelization across long sequences and suffering from vanishing gradients. Transformers replace recurrence entirely with Multi-Head Self-Attention: 1) All tokens are processed simultaneously in parallel using Query, Key, and Value matrix multiplications (Q * K^T / sqrt(d_k)); 2) The path length between any two tokens is O(1), enabling direct dependency modeling; and 3) Positional Encodings inject token order into the permutation-invariant architecture."
      },
      {
        id: 4,
        title: "Feature Scaling & Gradient Descent",
        difficulty: "Fundamental",
        tags: ["Optimization", "Preprocessing"],
        question: "Why is feature scaling (StandardScaler vs MinMaxScaler) crucial for distance-based and gradient-descent models like Logistic Regression and SVMs, but unnecessary for Decision Trees?",
        type: 'fillup',
        correctAnswer: "Decision Trees",
        blankPlaceholder: "Enter algorithm family invariant to monotonic feature scaling (e.g. Decision Trees)",
        keywords: ["gradient descent", "condition number", "standardscaler", "minmax", "euclidean distance", "decision tree", "monotonic", "orthogonality"],
        modelAnswer: "Gradient Descent optimization converges much faster when features are on the same scale, as unscaled features create elongated, skewed contour ellipses leading to oscillations. Similarly, distance-based algorithms (k-NN, SVM, k-Means) are dominated by features with arbitrarily large numerical ranges. Conversely, Decision Trees and Tree Ensembles (Random Forest, XGBoost) split each feature independently based on monotonic order thresholds (e.g., x_i > threshold), meaning linear scalings do not change the split criteria or information gain."
      },
      {
        id: 5,
        title: "Production MLOps & Model Drift",
        difficulty: "Advanced",
        tags: ["MLOps", "Production"],
        question: "What is the distinction between Data Drift and Concept Drift in a production AI system, and how would you build an automated monitoring and retraining pipeline?",
        type: 'subjective',
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
        type: 'mcq',
        options: ["A) Cache-Aside with TTL, distributed mutex locking (Redlock), and Bloom filters", "B) Disabling cache expiration and querying DB directly on every hit", "C) Infinite TTL with client-side localStorage caching only", "D) Dropping database tables whenever cache misses occur"],
        correctAnswer: "A) Cache-Aside with TTL, distributed mutex locking (Redlock), and Bloom filters",
        keywords: ["redis", "ttl", "cache aside", "write through", "thundering herd", "mutex lock", "bloom filter", "cache penetration", "cache stampede"],
        modelAnswer: "Redis provides sub-millisecond in-memory data retrieval (RAM vs Disk I/O). Key strategies: 1) Cache-Aside Pattern: Application queries cache first; on cache miss, queries DB and populates cache with TTL; 2) Cache Stampede / Thundering Herd: When a high-traffic key expires, multiple concurrent requests hammer the DB. Mitigate using distributed mutex locking (Redlock) or probabilistic early expiration; 3) Cache Penetration: Mitigate using Bloom Filters at the gateway or caching empty null results with short TTL."
      },
      {
        id: 2,
        title: "Database Indexing & PostgreSQL B-Trees",
        difficulty: "Intermediate",
        tags: ["Databases", "SQL", "Indexing"],
        question: "Explain how B-Tree indexes work in relational databases like PostgreSQL. When should you avoid adding an index, and what are the trade-offs on write-heavy tables?",
        type: 'fillup',
        correctAnswer: "B-Tree",
        blankPlaceholder: "Enter default balanced search tree index structure in PostgreSQL (e.g. B-Tree)",
        keywords: ["b-tree", "o(log n)", "write overhead", "disk space", "low cardinality", "table scan", "wal", "insert overhead", "selectivity"],
        modelAnswer: "A B-Tree (Balanced Tree) index maintains sorted multi-level leaf nodes pointing to physical tuple heap offsets, reducing search complexity from O(N) sequential table scan to O(log N). Trade-offs: 1) Every INSERT, UPDATE, or DELETE requires rebalancing and updating all corresponding index trees, generating extra Write-Ahead Logging (WAL) and disk write amplification; 2) Indexes consume significant RAM/disk buffer space. Avoid indexing low-cardinality columns (e.g., boolean flags) where query planners prefer sequential scans, and avoid over-indexing tables with high write-to-read ratios."
      },
      {
        id: 3,
        title: "Concurrency, Event Loop & Asynchronous I/O",
        difficulty: "Advanced",
        tags: ["Node.js", "Concurrency", "Architecture"],
        question: "What is the difference between concurrency and parallelism, and how does the single-threaded Event Loop in Node.js / JavaScript achieve high non-blocking I/O throughput?",
        type: 'subjective',
        keywords: ["concurrency vs parallelism", "event loop", "libuv", "call stack", "callback queue", "microtask queue", "non-blocking", "worker threads"],
        modelAnswer: "Concurrency is the composition of independently executing processes (interleaved execution on a single core), while Parallelism is the simultaneous execution of multiple computations on multiple physical CPU cores. Node.js uses a single-threaded Event Loop backed by the libuv threadpool: 1) JavaScript execution occurs on one main thread without locking overhead; 2) I/O operations (network sockets, disk, DB queries) are offloaded to OS kernel asynchronous primitives (epoll/kqueue); 3) When an I/O operation completes, its callback is enqueued into the Event Loop phases (Timers, Poll, Check) and Microtask Queue (Promises), ensuring the main thread never blocks waiting for I/O."
      },
      {
        id: 4,
        title: "REST vs. GraphQL API Design",
        difficulty: "Intermediate",
        tags: ["APIs", "System Design"],
        question: "Compare RESTful APIs with GraphQL in terms of network efficiency, over-fetching / under-fetching, caching simplicity, and schema governance.",
        type: 'mcq',
        options: ["A) REST has native HTTP caching; GraphQL prevents over/under-fetching but risks N+1 queries", "B) REST requires single POST endpoint; GraphQL uses standard HTTP verbs", "C) REST eliminates all database queries; GraphQL requires Redis", "D) GraphQL cannot return JSON responses"],
        correctAnswer: "A) REST has native HTTP caching; GraphQL prevents over/under-fetching but risks N+1 queries",
        keywords: ["rest", "graphql", "over-fetching", "under-fetching", "n+1 problem", "http caching", "schema stitching", "dataloader"],
        modelAnswer: "1) Network Efficiency: REST endpoints often suffer from Over-fetching (returning extraneous fields) or Under-fetching (requiring N network round-trips to assemble related resources). GraphQL allows clients to specify exact requested field shapes in a single query; 2) Caching: REST leverages native HTTP protocol caching (ETag, Cache-Control, edge CDNs) out-of-the-box. GraphQL uses single POST endpoints (/graphql), requiring client-side normalized caching (Apollo/Relay); 3) Database Performance: GraphQL queries can easily trigger the N+1 database problem if resolvers are not batched using DataLoader."
      },
      {
        id: 5,
        title: "Stateless JWT Authentication & Security",
        difficulty: "Advanced",
        tags: ["Security", "Authentication", "JWT"],
        question: "How do JWTs facilitate stateless authentication, and how should access and refresh tokens be stored to defend against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?",
        type: 'fillup',
        correctAnswer: "HttpOnly",
        blankPlaceholder: "Enter secure cookie flag preventing JavaScript XSS token theft",
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
        type: 'mcq',
        options: ["A) Containers share host OS kernel using cgroups/namespaces; VMs emulate full guest OS and virtual hardware", "B) VMs have faster boot times and smaller image footprints than containers", "C) Containers require Type 1 hypervisor (ESXi/Xen) while VMs do not", "D) Docker containers cannot run on Linux servers"],
        correctAnswer: "A) Containers share host OS kernel using cgroups/namespaces; VMs emulate full guest OS and virtual hardware",
        keywords: ["shared kernel", "hypervisor", "guest os", "namespaces", "cgroups", "isolation", "boot time", "resource overhead"],
        modelAnswer: "Virtual Machines run on a Hypervisor (Type 1 or Type 2) and require a complete, independent Guest Operating System kernel, virtualized BIOS, and emulated virtual hardware, resulting in gigabyte image sizes and minute-long boot times. Docker containers virtualize at the OS layer: they share the host OS kernel and use Linux cgroups (for resource limiting: CPU/RAM) and namespaces (for process, PID, network, and mount isolation). Because no guest OS boots, containers launch in milliseconds and consume negligible memory overhead."
      },
      {
        id: 2,
        title: "Kubernetes Core Architecture",
        difficulty: "Advanced",
        tags: ["Kubernetes", "DevOps"],
        question: "Explain the relationship and roles of Kubernetes Pods, ReplicaSets, Deployments, Services, and Ingress Controllers in a production cluster.",
        type: 'fillup',
        correctAnswer: "Pod",
        blankPlaceholder: "Enter smallest deployable compute unit in Kubernetes (e.g. Pod)",
        keywords: ["pod", "deployment", "replicaset", "clusterip", "service", "ingress", "kube-proxy", "rolling update", "self-healing"],
        modelAnswer: "1) Pod: Smallest deployable unit, encapsulating one or more tightly coupled containers sharing localhost network and storage volumes; 2) Deployment & ReplicaSet: Deployments manage declarative state and rolling updates with zero downtime, maintaining a desired count of identical Pods via ReplicaSets for self-healing; 3) Service: Provides a stable virtual ClusterIP and internal L4 load balancing across transient Pod IPs using label selectors; 4) Ingress Controller (e.g. NGINX Ingress): Acts as the cluster L7 reverse proxy, routing external HTTP/HTTPS traffic to internal Services based on hostnames and URL paths, managing SSL/TLS termination."
      },
      {
        id: 3,
        title: "Zero-Downtime Deployment Strategies",
        difficulty: "Intermediate",
        tags: ["CI/CD", "Deployments"],
        question: "Compare Blue-Green Deployments with Canary Deployments. How do you manage database schema migrations during zero-downtime releases?",
        type: 'mcq',
        options: ["A) Blue-Green switches 100% traffic instantly; Canary gradually routes a small percentage (e.g. 5%)", "B) Canary drops 100% of user traffic to run offline tests", "C) Blue-Green requires stopping all servers for 1 hour maintenance windows", "D) Canary deployment does not support automated rollback"],
        correctAnswer: "A) Blue-Green switches 100% traffic instantly; Canary gradually routes a small percentage (e.g. 5%)",
        keywords: ["blue green", "canary deployment", "traffic routing", "expand and contract", "backward compatibility", "rollback", "database migration"],
        modelAnswer: "1) Blue-Green: Maintains two identical production environments. Traffic is switched 100% instantly from Blue (active) to Green (new version) at the load balancer level, enabling instant rollback if issues arise; 2) Canary: Routes a small percentage of real user traffic (e.g. 5%) to the new version while monitoring error rates and latency before incrementally scaling to 100%; 3) Database Migrations: Zero-downtime requires the 'Expand and Contract' pattern: Step 1 (Expand) - Add new columns as nullable/default without dropping old columns, ensuring backward compatibility with both versions; Step 2 - Deploy code writing to both; Step 3 (Contract) - Backfill old data and safely remove deprecated schema."
      },
      {
        id: 4,
        title: "Infrastructure as Code & State Management",
        difficulty: "Intermediate",
        tags: ["Terraform", "IaC"],
        question: "Why is declarative Infrastructure as Code (Terraform) preferred over imperative CLI scripts, and how do you protect and manage the Terraform state file in team environments?",
        type: 'fillup',
        correctAnswer: "S3",
        blankPlaceholder: "Enter AWS storage service commonly used for remote Terraform state backend (e.g. S3)",
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

  // Start Interview Session — filter by difficulty, shuffle & pick quizQuestionCount questions
  const handleStartInterview = (domainKey) => {
    let bank = interviewQuestions[domainKey] || []
    // Filter by difficulty
    if (quizDifficulty !== 'mixed') {
      const diffMap = {
        easy: ['Easy', 'Fundamental'],
        medium: ['Intermediate'],
        hard: ['Advanced']
      }
      const allowed = diffMap[quizDifficulty] || []
      const filtered = bank.filter(q => allowed.includes(q.difficulty))
      // fall back to full bank if not enough questions
      bank = filtered.length >= 5 ? filtered : bank
    }
    const shuffled = shuffleArray(bank).slice(0, quizQuestionCount)
    setSessionQuestions(shuffled)
    setInterviewDomain(domainKey)
    setInterviewActive(true)
    setCurrentQIdx(0)
    const firstQ = shuffled[0]
    setUserAnswerText(firstQ?.type === 'problem' ? (firstQ.starterCode || '') : '')
    setSavedAnswers({})
    setEvaluationResults({})
    setTimerSeconds(quizQuestionCount * 45) // 45 seconds per question
    setTimerRunning(true)
    setSessionFinished(false)
    setShowModelAnswer(false)
    setShowReviewPanel(false)
  }

  // Evaluate Current Question Answer (Supports MCQ, Fill-up, Problem Solving & Subjective)
  const handleEvaluateAnswer = () => {
    const questionsList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
    const currentQ = questionsList[currentQIdx]
    const text = (userAnswerText || savedAnswers[currentQIdx] || '').trim()

    if (!text) {
      alert('Please provide an answer, fill the blank, or select an option to evaluate.')
      return
    }

    if ((!currentQ.type || currentQ.type === 'subjective') && text.length < 15) {
      alert('Please provide a more detailed technical explanation (at least a couple of sentences) to receive an AI evaluation.')
      return
    }

    setIsEvaluating(true)
    setTimeout(() => {
      let totalScore = 80
      let grade = 'Good - Solid Core Concepts'
      let strengths = []
      let improvements = []

      if (currentQ.type === 'mcq') {
        const isCorrect = text.trim().toLowerCase() === (currentQ.correctAnswer || '').trim().toLowerCase() ||
                          text.trim().startsWith(currentQ.correctAnswer?.slice(0, 2) || '')
        totalScore = isCorrect ? 96 : 52
        grade = isCorrect ? 'Exceptional - Accurate MCQ Choice' : 'Needs Practice - Incorrect Option'
        strengths = isCorrect ? [`Correctly identified: "${currentQ.correctAnswer}"`] : ['Active attempt at multiple choice problem']
        improvements = isCorrect ? ['Consistent accuracy across multiple choice tests.'] : [`Correct answer is: "${currentQ.correctAnswer}". Review explanation.`]
      } else if (currentQ.type === 'fillup') {
        const isCorrect = text.trim().toLowerCase().includes((currentQ.correctAnswer || '').trim().toLowerCase())
        totalScore = isCorrect ? 94 : 55
        grade = isCorrect ? 'Proficient - Exact Keyword Match' : 'Needs Practice - Missing Keyword'
        strengths = isCorrect ? [`Accurately identified term: "${currentQ.correctAnswer}"`] : ['Attempted keyword completion']
        improvements = isCorrect ? ['Solid syntax recall.'] : [`Expected keyword: "${currentQ.correctAnswer}".`]
      } else if (currentQ.type === 'problem') {
        const textLower = text.toLowerCase()
        const matched = (currentQ.keywords || []).filter(k => textLower.includes(k.toLowerCase()))
        const kwScore = Math.min(65, Math.round((matched.length / Math.max(2, (currentQ.keywords || []).length * 0.4)) * 65))
        const depthScore = Math.min(30, Math.round((text.length / 70) * 30))
        totalScore = Math.min(96, Math.max(50, kwScore + depthScore))
        grade = totalScore >= 85 ? 'Exceptional - Clean Implementation' : 'Good - Functional Logic'
        strengths = matched.length > 0 ? matched.slice(0, 3).map(k => `Implemented pattern: "${k}"`) : ['Structured programmatic solution']
        improvements = (currentQ.keywords || []).filter(k => !textLower.includes(k.toLowerCase())).slice(0, 2).map(k => `Could optimize: "${k}"`)
      } else {
        const textLower = text.toLowerCase()
        const matched = (currentQ.keywords || []).filter(k => textLower.includes(k.toLowerCase()))
        const wordCount = text.split(/\s+/).length
        const kwScore = Math.min(65, Math.round((matched.length / Math.max(3, (currentQ.keywords || []).length * 0.45)) * 65))
        const depthScore = Math.min(30, Math.round((wordCount / 50) * 30))
        totalScore = Math.min(96, Math.max(48, kwScore + depthScore))
        grade = totalScore >= 85 ? 'Exceptional - High Readiness' : totalScore >= 70 ? 'Good - Solid Core Concepts' : 'Needs Practice - Missing Key Terminology'
        strengths = matched.length > 0 ? matched.slice(0, 3).map(k => `Accurately articulated concept: "${k}"`) : ['Clear logical structure and technical attempt']
        improvements = (currentQ.keywords || []).filter(k => !textLower.includes(k.toLowerCase())).slice(0, 3).map(k => `Could elaborate on: "${k}"`)
      }

      const feedback = {
        score: totalScore,
        grade,
        strengths,
        improvements: improvements.length > 0 ? improvements : ['Excellent coverage across all primary evaluation criteria.'],
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
    const questionsList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
    if (nextIdx < questionsList.length) {
      if (userAnswerText.trim()) {
        setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
      }
      setCurrentQIdx(nextIdx)
      const nextQ = questionsList[nextIdx]
      const existing = savedAnswers[nextIdx]
      setUserAnswerText(existing !== undefined ? existing : (nextQ?.type === 'problem' ? (nextQ.starterCode || '') : ''))
      setShowModelAnswer(false)
    }
  }

  // Navigate to Previous Question
  const handlePrevQuestion = () => {
    const prevIdx = currentQIdx - 1
    const questionsList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
    if (prevIdx >= 0) {
      if (userAnswerText.trim()) {
        setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
      }
      setCurrentQIdx(prevIdx)
      const prevQ = questionsList[prevIdx]
      const existing = savedAnswers[prevIdx]
      setUserAnswerText(existing !== undefined ? existing : (prevQ?.type === 'problem' ? (prevQ.starterCode || '') : ''))
      setShowModelAnswer(false)
    }
  }

  // Finish Interview Session
  const handleFinishInterview = () => {
    const finalAnswers = { ...savedAnswers }
    if (userAnswerText.trim() && !savedAnswers[currentQIdx]) {
      finalAnswers[currentQIdx] = userAnswerText
      setSavedAnswers(finalAnswers)
    }
    setTimerRunning(false)
    setInterviewActive(false)
    setSessionFinished(true)

    // ── Save this session to interview history for My Progress ──
    const domainLabels = {
      technical: 'Technical Interview',
      hr: 'HR Interview',
      aptitude: 'Aptitude Test',
      coding: 'Coding Interview',
      ml: 'ML Interview',
      se: 'SE Interview',
      cloud: 'Cloud Interview'
    }
    // Compute average score from all evaluated questions in this session
    const allResults = Object.values(evaluationResults)
    const avgScore = allResults.length > 0
      ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length)
      : 70 // default if no answers evaluated

    const scoreColor = avgScore >= 85 ? '#10b981' : avgScore >= 70 ? '#38bdf8' : '#f59e0b'
    const scoreStatus = avgScore >= 85 ? 'Excellent' : avgScore >= 70 ? 'Good' : 'Proficient'

    const today = new Date()
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })

    setInterviewHistory(prev => [
      ...prev,
      { date: dateStr, domain: domainLabels[interviewDomain] || 'Interview', score: avgScore, color: scoreColor, status: scoreStatus }
    ])
  }

  // Colleges data
  const colleges = [
    { name: 'IIT Delhi', program: 'M.Tech in Machine Intelligence and Data Science', location: 'New Delhi', rating: '4.9 ★', nirf: 'NIRF #2' },
    { name: 'IIIT Hyderabad', program: 'Kohli Center on Intelligent Systems AI Specialization', location: 'Hyderabad', rating: '4.8 ★', nirf: 'Top AI Lab' },
    { name: 'BITS Pilani', program: 'B.E. Computer Science with AI & Deep Learning Minor', location: 'Pilani & Goa', rating: '4.7 ★', nirf: 'Tier 1' }
  ]

  // Certifications Hub State
  const [certFilterProvider, setCertFilterProvider] = useState('All')
  const [certFilterType, setCertFilterType] = useState('All')
  const [showAddCertModal, setShowAddCertModal] = useState(false)
  const [newCertTitle, setNewCertTitle] = useState('')
  const [newCertProvider, setNewCertProvider] = useState('Google')
  const [newCertUrl, setNewCertUrl] = useState('')
  const [studentCertifications, setStudentCertifications] = useState([
    {
      id: 1,
      title: "Google Data Analytics Professional Certificate",
      provider: "Google",
      issuer: "Coursera / Grow with Google",
      badge: "Verified Credential",
      skills: ["Data Analysis", "SQL", "R Programming", "Tableau", "Data Cleaning"],
      date: "Sep 2026",
      status: "Completed",
      credlyUrl: "https://www.coursera.org/professional-certificates/google-data-analytics"
    },
    {
      id: 2,
      title: "Python for Machine Learning Certification",
      provider: "Great Learning",
      issuer: "Great Learning Academy",
      badge: "Free Certified",
      skills: ["Python", "Supervised Learning", "Scikit-Learn", "NumPy", "Pandas"],
      date: "Oct 2026",
      status: "Completed",
      credlyUrl: "https://www.mygreatlearning.com/academy/learn-for-free/courses/python-for-machine-learning"
    }
  ])

  // Catalog of Recommended Industry Certifications to Bridge Skill Gaps
  const industryCertCatalog = [
    {
      id: 'g-1',
      title: 'Google IT Automation with Python',
      provider: 'Google',
      platform: 'Coursera / Google Skillshop',
      level: 'Beginner to Intermediate',
      duration: '4-6 Weeks (Self-paced)',
      cost: 'Financial Aid Available / Free Audit',
      type: 'Financial Aid',
      skillsCovered: ['Python', 'Git', 'Automation', 'Configuration Management', 'Cloud'],
      targetRoles: ['Machine Learning Engineer', 'Data Scientist', 'Full Stack Software Engineer'],
      link: 'https://grow.google/certificates/it-automation/',
      badgeColor: '#4285F4',
      rating: 4.8,
      studentsEnrolled: '320k+'
    },
    {
      id: 'gl-1',
      title: 'MLOps & Kubernetes Deployment Fundamentals',
      provider: 'Great Learning',
      platform: 'Great Learning Academy',
      level: 'Intermediate',
      duration: '3.5 Hours (Self-paced)',
      cost: '100% Free with Certificate',
      type: 'Free',
      skillsCovered: ['MLOps Pipeline Deployment', 'Kubernetes', 'Docker Containerization', 'CI/CD'],
      targetRoles: ['Machine Learning Engineer', 'Cloud Solutions Architect'],
      link: 'https://www.mygreatlearning.com/academy/learn-for-free/courses/kubernetes-tutorial',
      badgeColor: '#059669',
      rating: 4.7,
      studentsEnrolled: '95k+'
    },
    {
      id: 'gl-2',
      title: 'Cloud Computing & AWS Architecture Essentials',
      provider: 'Great Learning',
      platform: 'Great Learning Academy',
      level: 'Beginner',
      duration: '2.5 Hours (Self-paced)',
      cost: '100% Free with Certificate',
      type: 'Free',
      skillsCovered: ['AWS SageMaker', 'Cloud Architecture', 'S3 & EC2', 'IAM'],
      targetRoles: ['Cloud Solutions Architect', 'Machine Learning Engineer', 'Data Scientist'],
      link: 'https://www.mygreatlearning.com/academy/learn-for-free/courses/aws-for-beginners',
      badgeColor: '#059669',
      rating: 4.9,
      studentsEnrolled: '140k+'
    },
    {
      id: 'g-2',
      title: 'Google Cloud Digital Leader & ML Foundations',
      provider: 'Google',
      platform: 'Google Cloud Skills Boost',
      level: 'Foundational',
      duration: '15 Hours',
      cost: 'Free Tier / Skills Boost',
      type: 'Free',
      skillsCovered: ['Cloud Architecture', 'Google Cloud Platform', 'BigQuery', 'ML Infrastructure'],
      targetRoles: ['Cloud Solutions Architect', 'Data Scientist'],
      link: 'https://www.cloudskillsboost.google/paths/9',
      badgeColor: '#4285F4',
      rating: 4.9,
      studentsEnrolled: '210k+'
    },
    {
      id: 'aws-1',
      title: 'AWS Certified Machine Learning - Specialty Prep',
      provider: 'AWS',
      platform: 'AWS Skill Builder / Educate',
      level: 'Advanced',
      duration: '8 Weeks',
      cost: 'Free Student Tier via AWS Educate',
      type: 'Free',
      skillsCovered: ['AWS SageMaker', 'Feature Engineering', 'Model Tuning', 'Data Pipeline'],
      targetRoles: ['Machine Learning Engineer', 'Data Scientist'],
      link: 'https://aws.amazon.com/education/awseducate/',
      badgeColor: '#f59e0b',
      rating: 4.8,
      studentsEnrolled: '180k+'
    },
    {
      id: 'ms-1',
      title: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
      provider: 'Microsoft',
      platform: 'Microsoft Learn',
      level: 'Beginner',
      duration: '10 Hours',
      cost: '100% Free Learning Path + Free Student Exam Voucher',
      type: 'Free',
      skillsCovered: ['Machine Learning', 'Computer Vision', 'NLP', 'System Design'],
      targetRoles: ['Machine Learning Engineer', 'Product Manager'],
      link: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
      badgeColor: '#0284c7',
      rating: 4.8,
      studentsEnrolled: '450k+'
    },
    {
      id: 'ibm-1',
      title: 'IBM Full Stack Cloud Developer Professional Certificate',
      provider: 'IBM',
      platform: 'Coursera / IBM Training',
      level: 'Intermediate',
      duration: '3 Months (Self-paced)',
      cost: 'Financial Aid Available / Audit Free',
      type: 'Financial Aid',
      skillsCovered: ['System Design', 'Microservices', 'Docker', 'Kubernetes', 'CI/CD'],
      targetRoles: ['Full Stack Software Engineer', 'Cloud Solutions Architect'],
      link: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
      badgeColor: '#6366f1',
      rating: 4.7,
      studentsEnrolled: '88k+'
    }
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
    { id: 'certifications', label: 'Certifications', icon: Award },
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

                  <div className="stat-card-white" onClick={() => setActiveTab('certifications')} style={{ cursor: 'pointer' }} title="Click to view Certifications">
                    <div>
                      <div className="stat-card-label">Certifications</div>
                      <div className="stat-card-num">6</div>
                      <div className="stat-card-growth">
                        <TrendingUp size={14} />
                        <span>20% this month • View</span>
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

                
                {/* ═══════════════════════════════════════════════════════════════════
                    SKILL GAP ANALYSIS (ON MAIN DASHBOARD)
                   ═══════════════════════════════════════════════════════════════════ */}
                <div className="white-panel" style={{ marginTop: '1.25rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BarChart3 size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          Skill Gap Analysis
                        </h3>
                        <span className="match-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem' }}>
                          Target Role Gap
                        </span>
                      </div>
                      <p className="panel-sub" style={{ margin: 0 }}>
                        Benchmarked against canonical O*NET and LinkedIn job taxonomies
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Role:</span>
                      <select 
                        value={selectedTargetRole} 
                        onChange={(e) => setSelectedTargetRole(e.target.value)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', background: 'var(--bg-input)', color: '#ffffff', border: '1px solid var(--border)' }}
                      >
                        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    </div>
                  </div>

                  <div className="gap-columns-grid" style={{ marginTop: '1rem' }}>
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

                  <div className="alignment-bar-box" style={{ marginTop: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Target Role Alignment</span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Missing 4 competencies to reach 100% suitability</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '50%', maxWidth: '350px' }}>
                      <div className="prob-track" style={{ flex: 1, height: '10px' }}>
                        <div className="prob-fill" style={{ width: '72%' }} />
                      </div>
                      <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem' }}>72%</span>
                    </div>
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

            {/* 4. CAREER RECOMMENDATIONS (MILESTONE 2 & MILESTONE 4 BENCHMARKS) */}
            {activeTab === 'career-recommendations' && (
              <div>
                <div className="welcome-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2>Career Intelligence & Multi-Model Engine</h2>
                      <p>Benchmarked across Logistic Regression, Random Forest, and XGBoost Ensembles (PDF Page 5 & 6)</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button className="btn-pill-outline" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', fontSize: '0.8rem' }}>
                        <Download size={14} />
                        <span>Export to CSV</span>
                      </button>
                      <button className="btn-solid-blue" onClick={handleExportRoadmapPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', fontSize: '0.8rem' }}>
                        <Printer size={14} />
                        <span>Export to PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Model Comparison Bar Chart (Page 5) */}
                <div className="white-panel" style={{ marginBottom: '1.75rem' }}>
                  <div className="panel-header">
                    <div>
                      <h3>Model Comparison — Macro F1-Score</h3>
                      <p className="panel-sub">Benchmarked on multi-class career transition validation split (PDF Page 5)</p>
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

                {/* Milestone 2 2-Column: Top-5 Rankings + t-SNE Scatter Plot (Exact match of PDF Page 5) */}
                <div className="dash-2col" style={{ marginBottom: '1.75rem' }}>
                  {/* Top-5 Career Recommendations */}
                  <div className="white-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="panel-header" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Top-5 Career Recommendations</h3>
                          <p className="panel-sub">Ranked by XGBoost Ensemble with market signals</p>
                        </div>
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

                    <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Top-5 Recommendation Accuracy</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Top-5 Recall: 94% (Target ≥90% Passed ✅)</span>
                    </div>
                  </div>

                  {/* t-SNE Visualization: Skill Embeddings (SBERT) (PDF Page 5) */}
                  <div className="white-panel">
                    <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>t-SNE Visualization: Skill Embeddings (SBERT)</h3>
                        <p className="panel-sub">2D projection of canonical skill clusters & interdisciplinary overlap</p>
                      </div>
                    </div>

                    <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                      <svg viewBox="0 0 380 230" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        {/* Axes */}
                        <line x1="45" y1="20" x2="45" y2="200" stroke="rgba(255, 255, 255, 0.12)" />
                        <line x1="45" y1="200" x2="360" y2="200" stroke="rgba(255, 255, 255, 0.12)" />

                        {/* Ticks and Labels */}
                        <text x="10" y="30" fill="#64748b" fontSize="8">30</text>
                        <text x="10" y="85" fill="#64748b" fontSize="8">20</text>
                        <text x="10" y="140" fill="#64748b" fontSize="8">10</text>
                        <text x="15" y="195" fill="#64748b" fontSize="8">0</text>
                        <text x="5" y="115" fill="#94a3b8" fontSize="8" transform="rotate(-90 20 115)">t-SNE Component 2</text>

                        <text x="50" y="215" fill="#64748b" fontSize="8">-30</text>
                        <text x="120" y="215" fill="#64748b" fontSize="8">-20</text>
                        <text x="190" y="215" fill="#64748b" fontSize="8">-10</text>
                        <text x="260" y="215" fill="#64748b" fontSize="8">10</text>
                        <text x="330" y="215" fill="#64748b" fontSize="8">30</text>
                        <text x="190" y="228" fill="#94a3b8" fontSize="8" textAnchor="middle">t-SNE Component 1</text>

                        {/* Interdisciplinary Skillset Overlap region (Dotted ellipse from Page 5) */}
                        <ellipse cx="160" cy="110" rx="42" ry="32" fill="rgba(37, 99, 235, 0.08)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3" />
                        <text x="160" y="108" fill="#38bdf8" fontSize="7.5" textAnchor="middle" fontWeight="600">Interdisciplinary</text>
                        <text x="160" y="118" fill="#38bdf8" fontSize="7.5" textAnchor="middle" fontWeight="600">Skillset Overlap</text>

                        {/* Scatter Points: Clustered by Domain */}
                        {/* Software Engineering (Blue: #3b82f6) */}
                        {[
                          [75, 45, 'Docker'], [85, 60, 'K8s'], [100, 52, 'CI/CD'], [70, 75, 'Java'],
                          [95, 80, 'APIs'], [110, 65, 'Linux'], [120, 85, 'Git'], [90, 95, 'SQL']
                        ].map(([x, y, label], i) => (
                          <g key={`se-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#3b82f6" opacity="0.85" />
                          </g>
                        ))}

                        {/* Data Science (Green: #10b981) */}
                        {[
                          [180, 50, 'Pandas'], [195, 65, 'NumPy'], [210, 45, 'Stats'], [225, 60, 'SQL'],
                          [200, 80, 'EDA'], [185, 90, 'Tableau'], [215, 95, 'Math'], [170, 70, 'Python']
                        ].map(([x, y, label], i) => (
                          <g key={`ds-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#10b981" opacity="0.85" />
                          </g>
                        ))}

                        {/* AI / ML (Pink: #ec4899) */}
                        {[
                          [150, 95, 'PyTorch'], [165, 85, 'DL'], [145, 125, 'XGBoost'], [175, 120, 'NLP'],
                          [160, 135, 'TF'], [155, 105, 'CV'], [140, 110, 'MLOps']
                        ].map(([x, y, label], i) => (
                          <g key={`ml-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#ec4899" opacity="0.9" />
                          </g>
                        ))}

                        {/* Product Management (Orange: #f59e0b) */}
                        {[
                          [230, 140, 'Agile'], [245, 130, 'Strategy'], [260, 150, 'Roadmap'], [275, 135, 'UX'],
                          [250, 165, 'A/B Test'], [265, 175, 'KPIs']
                        ].map(([x, y, label], i) => (
                          <g key={`pm-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#f59e0b" opacity="0.85" />
                          </g>
                        ))}

                        {/* Research (Purple: #8b5cf6) */}
                        {[
                          [105, 150, 'Papers'], [90, 165, 'Algos'], [115, 175, 'Proofs'], [100, 185, 'Opt']
                        ].map(([x, y, label], i) => (
                          <g key={`res-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#8b5cf6" opacity="0.85" />
                          </g>
                        ))}

                        {/* Finance (Cyan: #06b6d4) */}
                        {[
                          [210, 175, 'Risk'], [225, 185, 'Valuation'], [240, 180, 'Forecasting']
                        ].map(([x, y, label], i) => (
                          <g key={`fin-${i}`}>
                            <circle cx={x} cy={y} r="3.5" fill="#06b6d4" opacity="0.85" />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Legend from PDF Page 5 */}
                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.72rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> Software Engineering</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Data Science</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> Product Management</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span> AI / ML</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> Research</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span> Finance</span>
                    </div>
                  </div>
                </div>

                {/* MLflow Model Registry UI Card (PDF Page 6) */}
                <div className="white-panel" style={{ marginBottom: '1.75rem' }}>
                  <div className="panel-header" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Brain size={20} color="#38bdf8" />
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>MLflow Model Registry</h3>
                        <p className="panel-sub">Versioned artifacts, A/B model tracking & promotion status (PDF Page 6)</p>
                      </div>
                    </div>
                    <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      v2 Active in Production
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', opacity: 0.75 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.9rem' }}>v1 (Logistic Regression)</span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>Archived</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>Created: 2023-07-02, 20:34</div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Macro F1-Score: <strong>0.65</strong> • Top-1: <strong>66%</strong></div>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>v2 (XGBoost Ensemble)</span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>Production ★</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>Created: 2023-07-23, 16:38</div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Macro F1-Score: <strong style={{ color: '#d97706' }}>0.82 ★</strong> • Top-5 Recall: <strong style={{ color: '#10b981' }}>94%</strong></div>
                    </div>
                  </div>
                </div>

                {/* Career Comparison & 4-Axis Radar Chart (Exact match of PDF Page 6) */}
                <div className="white-panel" style={{ marginBottom: '1.5rem' }}>
                  <div className="panel-header" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                        Career Comparison: Data Scientist vs Product Manager
                      </h3>
                      <p className="panel-sub">Multi-dimensional competency benchmark & role requirements (PDF Page 6)</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-pill-outline" onClick={handleExportCSV} style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        Export to CSV
                      </button>
                      <button className="btn-pill-outline" onClick={handleExportRoadmapPDF} style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        Export to PDF
                      </button>
                    </div>
                  </div>

                  <div className="dash-2col" style={{ alignItems: 'center' }}>
                    {/* Left: Responsibilities comparison */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>Data Scientist</h4>
                        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '6px' }}>
                          <strong>Key responsibilities:</strong> Performance modeling and predictive analytics, content categorization, statistical inference, and proactive interpreted datasets.
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          <strong>Example roles:</strong> Data Scientist, Quantitative Analyst, Data Scientist Lead
                        </p>
                      </div>

                      <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', marginBottom: '6px' }}>Product Manager</h4>
                        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '6px' }}>
                          <strong>Key responsibilities:</strong> Prioritization and roadmap execution, team alignment, stakeholder communication, customer interviews, and user analytics.
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          <strong>Example roles:</strong> Product Manager, Scrum Product Owner, Growth Lead
                        </p>
                      </div>
                    </div>

                    {/* Right: 4-Axis Radar Chart (PDF Page 6) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '280px', height: '240px' }}>
                        <svg viewBox="0 0 300 260" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          {/* Radial background grids (25%, 50%, 75%, 100%) */}
                          {[25, 50, 75, 100].map((level) => {
                            const r = (level / 100) * 85
                            return (
                              <polygon
                                key={level}
                                points={`150,${130 - r} ${150 + r},130 150,${130 + r} ${150 - r},130`}
                                fill="transparent"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="1"
                              />
                            )
                          })}

                          {/* 4 Axes */}
                          <line x1="150" y1="45" x2="150" y2="215" stroke="rgba(255, 255, 255, 0.15)" />
                          <line x1="65" y1="130" x2="235" y2="130" stroke="rgba(255, 255, 255, 0.15)" />

                          {/* Axis Labels */}
                          <text x="150" y="35" fill="#e2e8f0" fontSize="10" fontWeight="700" textAnchor="middle">Coding (85% vs 40%)</text>
                          <text x="245" y="134" fill="#e2e8f0" fontSize="10" fontWeight="700">Statistics</text>
                          <text x="150" y="235" fill="#e2e8f0" fontSize="10" fontWeight="700" textAnchor="middle">Business Acumen</text>
                          <text x="55" y="134" fill="#e2e8f0" fontSize="10" fontWeight="700" textAnchor="end">Communication</text>

                          {/* Data Scientist Polygon (Cyan/Blue #38bdf8) */}
                          {/* Coding: 85 -> 130 - 0.85*85 = 57.75 */}
                          {/* Statistics: 92 -> 150 + 0.92*85 = 228.2 */}
                          {/* Business: 55 -> 130 + 0.55*85 = 176.75 */}
                          {/* Communication: 65 -> 150 - 0.65*85 = 94.75 */}
                          <polygon
                            points="150,58 228,130 150,177 95,130"
                            fill="rgba(56, 189, 248, 0.25)"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                          />

                          {/* Product Manager Polygon (Orange #f59e0b) */}
                          {/* Coding: 40 -> 130 - 0.40*85 = 96 */}
                          {/* Statistics: 50 -> 150 + 0.50*85 = 192.5 */}
                          {/* Business: 90 -> 130 + 0.90*85 = 206.5 */}
                          {/* Communication: 95 -> 150 - 0.95*85 = 69.25 */}
                          <polygon
                            points="150,96 193,130 150,207 69,130"
                            fill="rgba(245, 158, 11, 0.25)"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>

                      {/* Radar Legend */}
                      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600 }}>
                          <span style={{ width: '12px', height: '3px', background: '#38bdf8', borderRadius: '2px' }}></span>
                          Data Scientist
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 600 }}>
                          <span style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></span>
                          Product Manager
                        </span>
                      </div>
                    </div>
                  </div>
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

            {/* ═══════════════════════════════════════════════════════════════════
                CERTIFICATIONS TAB (DEDICATED SIDEBAR HEADING)
               ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'certifications' && (
              <div>
                <div className="welcome-header">
                  <h2>Industry Certifications & Credentials Hub</h2>
                  <p>Accredited professional certifications from Google, Great Learning, AWS, and Microsoft to bridge competency gaps</p>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
                    CERTIFICATIONS SECTION (BRIDGING SKILL GAPS FOR STUDENTS)
                   ═══════════════════════════════════════════════════════════════════ */}
                <div className="white-panel" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(37,99,235,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          Certifications
                        </h3>
                        <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem' }}>
                          Accredited & Free Tracks
                        </span>
                      </div>
                      <p className="panel-sub" style={{ margin: 0 }}>
                        Curated industry-recognized certificates from Google, Great Learning, Microsoft & AWS to bridge your missing skills for {selectedTargetRole}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn-solid-blue"
                        onClick={() => setShowAddCertModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                      >
                        <Award size={15} />
                        <span>Add My Certificate</span>
                      </button>
                    </div>
                  </div>

                  {/* Student's Verified Credentials Shelf */}
                  <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>🎓 Student Credentials Portfolio</span>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '9999px' }}>
                          {studentCertifications.length} Verified
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verifiable via Credly / Institutional Registry</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                      {studentCertifications.map((sc) => (
                        <div
                          key={sc.id}
                          style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: sc.provider === 'Google' ? 'rgba(66, 133, 244, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                                color: sc.provider === 'Google' ? '#60a5fa' : '#34d399'
                              }}>
                                {sc.provider}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                                <CheckCircle2 size={12} /> {sc.badge}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                              {sc.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
                              Issued by: {sc.issuer} • {sc.date}
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                              {sc.skills.map((sk, sidx) => (
                                <span key={sidx} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                                  ✓ {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Status: Authentic</span>
                            <a
                              href={sc.credlyUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                            >
                              <span>View Certificate</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guide Info Banner for Students */}
                  <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '8px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ color: '#38bdf8', marginTop: '2px' }}>
                      <Brain size={20} />
                    </div>
                    <div style={{ flex: 1, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#ffffff' }}>How to earn these accredited certifications for free or student aid:</strong>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#60a5fa' }}>• Google Career Certs:</strong> Apply via Coursera's <em>"Financial Aid Available"</em> link on each course page. Approved in 14 days for 100% free certification.
                        </div>
                        <div>
                          <strong style={{ color: '#34d399' }}>• Great Learning Academy:</strong> 100% completely free enrollment & instant certificate on scoring 60%+ in self-paced quiz assessments.
                        </div>
                        <div>
                          <strong style={{ color: '#f59e0b' }}>• AWS & Microsoft:</strong> Free sandboxes on Microsoft Learn & AWS Educate with free student verification badges.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filters: Provider & Cost Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '4px' }}>Filter Provider:</span>
                      {['All', 'Google', 'Great Learning', 'AWS', 'Microsoft', 'IBM'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setCertFilterProvider(p)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: certFilterProvider === p ? 700 : 500,
                            border: 'none',
                            background: certFilterProvider === p ? '#2563eb' : 'rgba(255,255,255,0.07)',
                            color: certFilterProvider === p ? '#ffffff' : '#cbd5e1',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Type:</span>
                      {['All', 'Free', 'Financial Aid'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setCertFilterType(t)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: certFilterType === t ? 700 : 500,
                            border: certFilterType === t ? '1px solid #10b981' : '1px solid var(--border)',
                            background: certFilterType === t ? 'rgba(16,185,129,0.15)' : 'transparent',
                            color: certFilterType === t ? '#10b981' : '#94a3b8',
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Certifications Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1rem' }}>
                    {industryCertCatalog
                      .filter(c => certFilterProvider === 'All' || c.provider === certFilterProvider)
                      .filter(c => certFilterType === 'All' || c.type === certFilterType)
                      .map((cert) => (
                        <div
                          key={cert.id}
                          className="certification-card"
                          style={{
                            borderRadius: '10px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s ease, border-color 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 9px',
                                borderRadius: '4px',
                                background: cert.provider === 'Google' ? 'rgba(66, 133, 244, 0.15)' :
                                            cert.provider === 'Great Learning' ? 'rgba(5, 150, 105, 0.15)' :
                                            cert.provider === 'AWS' ? 'rgba(245, 158, 11, 0.15)' :
                                            cert.provider === 'Microsoft' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: cert.provider === 'Google' ? '#60a5fa' :
                                       cert.provider === 'Great Learning' ? '#34d399' :
                                       cert.provider === 'AWS' ? '#fbbf24' :
                                       cert.provider === 'Microsoft' ? '#38bdf8' : '#a5b4fc'
                              }}>
                                {cert.provider}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                                {cert.cost}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px', lineHeight: 1.4 }}>
                              {cert.title}
                            </h4>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                              {cert.platform} • {cert.duration} • Level: {cert.level}
                            </div>

                            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                              Skills Targeted to Fill Gaps:
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                              {cert.skillsCovered.map((sk, sidx) => (
                                <span key={sidx} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                  + {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              ⭐ {cert.rating} ({cert.studentsEnrolled} students)
                            </div>
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-solid-blue"
                              style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Enroll Course</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Modal to Upload / Add Student Certificate */}
                {showAddCertModal && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem'
                  }}>
                    <div style={{
                      width: '100%',
                      maxWidth: '480px',
                      background: '#111827',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      padding: '1.5rem',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Award size={20} color="#38bdf8" />
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Add Completed Certificate</h3>
                        </div>
                        <button
                          onClick={() => setShowAddCertModal(false)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Course / Certificate Title *</label>
                          <input
                            type="text"
                            value={newCertTitle}
                            onChange={(e) => setNewCertTitle(e.target.value)}
                            placeholder="e.g. Google Data Analytics or Great Learning Python"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#ffffff', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Provider / Organization *</label>
                          <select
                            value={newCertProvider}
                            onChange={(e) => setNewCertProvider(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#ffffff', fontSize: '0.85rem' }}
                          >
                            <option value="Google">Google (Grow with Google / Coursera)</option>
                            <option value="Great Learning">Great Learning Academy</option>
                            <option value="AWS">Amazon Web Services (AWS Educate)</option>
                            <option value="Microsoft">Microsoft Learn</option>
                            <option value="IBM">IBM Developer Skills Network</option>
                            <option value="Other">Other Verified Academy</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Verification Link or Credly ID (Optional)</label>
                          <input
                            type="text"
                            value={newCertUrl}
                            onChange={(e) => setNewCertUrl(e.target.value)}
                            placeholder="https://coursera.org/verify/... or certificate URL"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#ffffff', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-secondary"
                            onClick={() => setShowAddCertModal(false)}
                            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-solid-blue"
                            onClick={() => {
                              if (!newCertTitle.trim()) {
                                alert('Please provide the certificate title.');
                                return;
                              }
                              const newEntry = {
                                id: Date.now(),
                                title: newCertTitle,
                                provider: newCertProvider,
                                issuer: `${newCertProvider} Academy`,
                                badge: 'Student Verified',
                                skills: ['Verified Competency', 'Skill Gap Addressed'],
                                date: 'Nov 2026',
                                status: 'Completed',
                                credlyUrl: newCertUrl.trim() || 'https://www.coursera.org/'
                              };
                              setStudentCertifications(prev => [newEntry, ...prev]);
                              setNewCertTitle('');
                              setNewCertUrl('');
                              setShowAddCertModal(false);
                            }}
                            style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                          >
                            Save to Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

                      {/* ── Quiz Configuration Row ── */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>

                        {/* Difficulty Selector */}
                        <div style={{ padding: '1rem 1.1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🎯 Difficulty Level
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                              { key: 'easy',   label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.15)',  desc: 'Fundamentals' },
                              { key: 'medium', label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  desc: 'Intermediate' },
                              { key: 'hard',   label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   desc: 'Advanced' },
                              { key: 'mixed',  label: 'Mixed',  color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', desc: 'All levels' }
                            ].map(d => (
                              <button
                                key={d.key}
                                onClick={() => setQuizDifficulty(d.key)}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  border: quizDifficulty === d.key ? `2px solid ${d.color}` : '2px solid transparent',
                                  background: quizDifficulty === d.key ? d.bg : 'rgba(255,255,255,0.05)',
                                  color: quizDifficulty === d.key ? d.color : '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '0.82rem',
                                  fontWeight: quizDifficulty === d.key ? 700 : 500,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '2px',
                                  transition: 'all 0.15s ease',
                                  minWidth: '56px'
                                }}
                              >
                                <span>{d.label}</span>
                                <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>{d.desc}</span>
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.5rem' }}>
                            {quizDifficulty === 'easy' && '✅ Fundamental & Easy questions only'}
                            {quizDifficulty === 'medium' && '✅ Intermediate level questions only'}
                            {quizDifficulty === 'hard' && '✅ Advanced level questions only'}
                            {quizDifficulty === 'mixed' && '✅ Questions from all difficulty levels'}
                          </div>
                        </div>

                        {/* Question Count Selector */}
                        <div style={{ padding: '1rem 1.1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            📝 Number of Questions
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                            {[20, 25, 30, 35, 40].map(n => (
                              <button
                                key={n}
                                onClick={() => setQuizQuestionCount(n)}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  border: quizQuestionCount === n ? '2px solid #38bdf8' : '2px solid transparent',
                                  background: quizQuestionCount === n ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)',
                                  color: quizQuestionCount === n ? '#38bdf8' : '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: quizQuestionCount === n ? 700 : 500,
                                  transition: 'all 0.15s ease',
                                  minWidth: '44px',
                                  textAlign: 'center'
                                }}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                          {/* Slider */}
                          <input
                            type="range"
                            min={20}
                            max={40}
                            step={1}
                            value={quizQuestionCount}
                            onChange={e => setQuizQuestionCount(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                            <span>Min: 20</span>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{quizQuestionCount} Questions Selected</span>
                            <span>Max: 40</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem' }}>
                            ⏱️ Estimated time: ~{Math.round(quizQuestionCount * 1.5)} minutes
                          </div>
                        </div>
                      </div>

                      {/* Summary strip before start */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', padding: '0.65rem 1rem', borderRadius: '8px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>{interviewDomain.charAt(0).toUpperCase() + interviewDomain.slice(1)}</span>
                          {' · '}
                          <span style={{
                            color: quizDifficulty === 'easy' ? '#10b981' : quizDifficulty === 'medium' ? '#f59e0b' : quizDifficulty === 'hard' ? '#ef4444' : '#a78bfa',
                            fontWeight: 700, textTransform: 'capitalize'
                          }}>{quizDifficulty}</span>
                          {' · '}
                          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{quizQuestionCount} Questions</span>
                          {' · '}
                          <span>~{Math.round(quizQuestionCount * 1.5)} min</span>
                        </div>
                        <button
                          className="btn-solid-blue"
                          onClick={() => handleStartInterview(interviewDomain)}
                          style={{ padding: '10px 28px', fontSize: '0.95rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)' }}
                        >
                          <span>🚀 Start Quiz</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Active Interview Practice Screen - Panel 2 */}
                {interviewActive && !sessionFinished && !showReviewPanel && (
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {/* Difficulty badge */}
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: quizDifficulty === 'easy' ? 'rgba(16,185,129,0.15)' : quizDifficulty === 'medium' ? 'rgba(245,158,11,0.15)' : quizDifficulty === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(167,139,250,0.15)',
                          color: quizDifficulty === 'easy' ? '#10b981' : quizDifficulty === 'medium' ? '#f59e0b' : quizDifficulty === 'hard' ? '#ef4444' : '#a78bfa',
                          border: `1px solid ${quizDifficulty === 'easy' ? 'rgba(16,185,129,0.3)' : quizDifficulty === 'medium' ? 'rgba(245,158,11,0.3)' : quizDifficulty === 'hard' ? 'rgba(239,68,68,0.3)' : 'rgba(167,139,250,0.3)'}`,
                          textTransform: 'capitalize'
                        }}>
                          {quizDifficulty === 'easy' ? '🟢' : quizDifficulty === 'medium' ? '🟡' : quizDifficulty === 'hard' ? '🔴' : '🟣'} {quizDifficulty}
                        </span>
                        {/* Timer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700 }}>
                          <Clock size={16} />
                          <span>{formatTimer(timerSeconds)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Question Navigator Strip */}
                    {(() => {
                      const qList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
                      return (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                          {qList.map((_, idx) => {
                            const isAnswered = !!(savedAnswers[idx] && String(savedAnswers[idx]).trim())
                            const isCurrent = idx === currentQIdx
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (userAnswerText.trim()) setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
                                  setCurrentQIdx(idx)
                                  const nextQ = qList[idx]
                                  setUserAnswerText(savedAnswers[idx] || (nextQ?.type === 'problem' ? (nextQ.starterCode || '') : ''))
                                }}
                                title={isAnswered ? 'Answered' : 'Not answered yet'}
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '8px',
                                  border: isCurrent ? '2px solid #38bdf8' : isAnswered ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.15)',
                                  background: isCurrent ? 'rgba(56,189,248,0.2)' : isAnswered ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                                  color: isCurrent ? '#38bdf8' : isAnswered ? '#10b981' : '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  position: 'relative'
                                }}
                              >
                                {isAnswered && !isCurrent ? '✓' : idx + 1}
                              </button>
                            )
                          })}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(16,185,129,0.4)', border: '1.5px solid #10b981', display: 'inline-block' }} />
                              Answered ({Object.values(savedAnswers).filter(v => String(v).trim()).length}/{qList.length})
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.15)', display: 'inline-block' }} />
                              Unanswered ({qList.length - Object.values(savedAnswers).filter(v => String(v).trim()).length}/{qList.length})
                            </span>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Progress Bar */}
                    {(() => {
                      const questionsList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                                  <span className="match-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                                    {q.tags ? q.tags.join(' - ') : 'Technical Interview'}
                                  </span>
                                  <span className="match-badge" style={{
                                    background: q.type === 'mcq' ? 'rgba(16, 185, 129, 0.15)' : q.type === 'fillup' ? 'rgba(245, 158, 11, 0.15)' : q.type === 'problem' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                    color: q.type === 'mcq' ? '#10b981' : q.type === 'fillup' ? '#f59e0b' : q.type === 'problem' ? '#c084fc' : '#60a5fa',
                                    fontWeight: 700
                                  }}>
                                    {q.type === 'mcq' ? '🎯 Multiple Choice (MCQ)' : q.type === 'fillup' ? '✏️ Fill in the Blank' : q.type === 'problem' ? '💻 Problem Solving' : '📝 Conceptual Explanation'}
                                  </span>
                                </div>
                                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                                  {q.question}
                                </h3>
                              </div>
                              <div className="hint-callout" style={{ maxWidth: '320px' }}>
                                <div style={{ fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span>💡 Hint</span>
                                </div>
                                <div>{q.hint || 'Think about its features and practical applications...'}</div>
                              </div>
                            </div>

                            {/* 1. MCQ FORMAT */}
                            {q.type === 'mcq' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                {(q.options || []).map((opt, oIdx) => {
                                  const currentVal = userAnswerText !== '' ? userAnswerText : (savedAnswers[currentQIdx] || '')
                                  const isSelected = currentVal === opt
                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => {
                                        setUserAnswerText(opt)
                                        setSavedAnswers(prev => ({ ...prev, [currentQIdx]: opt }))
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.85rem',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        background: isSelected ? 'rgba(37, 99, 235, 0.22)' : 'var(--bg-card)',
                                        border: isSelected ? '2px solid #2563eb' : '1px solid var(--border)',
                                        color: isSelected ? '#ffffff' : '#cbd5e1',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '0.92rem',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <span style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        background: isSelected ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        flexShrink: 0
                                      }}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      <span style={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                                      {isSelected && <Check size={18} color="#38bdf8" />}
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* 2. FILL IN THE BLANK FORMAT */}
                            {q.type === 'fillup' && (
                              <div style={{ marginBottom: '1.25rem', padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                  <span>✏️ Type the exact missing keyword, formula or terminology:</span>
                                </div>
                                <input
                                  type="text"
                                  value={userAnswerText !== '' ? userAnswerText : (savedAnswers[currentQIdx] || '')}
                                  onChange={(e) => {
                                    setUserAnswerText(e.target.value)
                                    setSavedAnswers(prev => ({ ...prev, [currentQIdx]: e.target.value }))
                                  }}
                                  placeholder={q.blankPlaceholder || "Enter missing keyword / term here..."}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-input)',
                                    border: '2px solid #2563eb',
                                    color: '#ffffff',
                                    fontSize: '0.95rem',
                                    fontFamily: 'Consolas, monospace',
                                    boxSizing: 'border-box'
                                  }}
                                />
                              </div>
                            )}

                            {/* 3. PROBLEM SOLVING / CODING FORMAT */}
                            {q.type === 'problem' && (
                              <div style={{ marginBottom: '1.25rem' }}>
                                {(q.sampleInput || q.sampleOutput) && (
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem', padding: '0.85rem 1rem', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.25)', fontSize: '0.82rem' }}>
                                    {q.sampleInput && <div><span style={{ color: '#c084fc', fontWeight: 700 }}>Input: </span><code style={{ color: '#e2e8f0' }}>{q.sampleInput}</code></div>}
                                    {q.sampleOutput && <div><span style={{ color: '#c084fc', fontWeight: 700 }}>Output: </span><code style={{ color: '#e2e8f0' }}>{q.sampleOutput}</code></div>}
                                    {q.constraints && <div><span style={{ color: '#c084fc', fontWeight: 700 }}>Target: </span><code style={{ color: '#e2e8f0' }}>{q.constraints}</code></div>}
                                  </div>
                                )}

                                <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px', background: '#070e28', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', color: '#94a3b8' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                                      <span style={{ marginLeft: '6px', fontWeight: 600, color: '#e2e8f0' }}>solution.py</span>
                                    </div>
                                    <span>Interactive Code Workspace</span>
                                  </div>
                                  <textarea
                                    rows={8}
                                    value={userAnswerText !== '' ? userAnswerText : (savedAnswers[currentQIdx] !== undefined ? savedAnswers[currentQIdx] : (q.starterCode || ''))}
                                    onChange={(e) => {
                                      setUserAnswerText(e.target.value)
                                      setSavedAnswers(prev => ({ ...prev, [currentQIdx]: e.target.value }))
                                    }}
                                    placeholder="Write your code or problem-solving logic here..."
                                    style={{
                                      width: '100%',
                                      padding: '14px',
                                      background: '#0a0f1d',
                                      border: 'none',
                                      color: '#38bdf8',
                                      fontFamily: 'Consolas, "Fira Code", monospace',
                                      fontSize: '0.88rem',
                                      lineHeight: 1.6,
                                      resize: 'vertical',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* 4. SUBJECTIVE / CONCEPTUAL EXPLANATION (DEFAULT) */}
                            {(!q.type || q.type === 'subjective') && (
                              <div style={{ marginBottom: '1.25rem' }}>
                                <textarea
                                  rows={6}
                                  value={userAnswerText !== '' ? userAnswerText : (savedAnswers[currentQIdx] || '')}
                                  onChange={(e) => {
                                    setUserAnswerText(e.target.value)
                                    setSavedAnswers(prev => ({ ...prev, [currentQIdx]: e.target.value }))
                                  }}
                                  placeholder="Type your explanation or technical answer here..."
                                  style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box' }}
                                />
                              </div>
                            )}

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
                                  onClick={() => {
                                    if (userAnswerText.trim()) {
                                      setSavedAnswers(prev => ({ ...prev, [currentQIdx]: userAnswerText }))
                                    }
                                    setShowReviewPanel(true)
                                  }}
                                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '9px 28px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
                                >
                                  <span>📋 Review & Submit</span>
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

                {/* 2.5 Pre-Submit Review Panel */}
                {interviewActive && showReviewPanel && !sessionFinished && (
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        onClick={() => setShowReviewPanel(false)}
                        style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}
                      >
                        <ArrowLeft size={18} />
                        <span>Back to Questions</span>
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700 }}>
                        <Clock size={16} />
                        <span>{formatTimer(timerSeconds)}</span>
                      </div>
                    </div>

                    {/* Review Summary Card */}
                    {(() => {
                      const qList = sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])
                      const answeredCount = Object.values(savedAnswers).filter(v => String(v).trim()).length
                      const unansweredCount = qList.length - answeredCount
                      return (
                        <div>
                          {/* Stats Row */}
                          <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              📋 Quiz Overview — Ready to Submit?
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{answeredCount}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>✅ Answered</div>
                              </div>
                              <div style={{ padding: '1rem', borderRadius: '10px', background: unansweredCount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.05)', border: unansweredCount > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: unansweredCount > 0 ? '#f59e0b' : '#10b981' }}>{unansweredCount}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{unansweredCount > 0 ? '⚠️ Not Answered' : '🎉 All Answered!'}</div>
                              </div>
                              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{qList.length}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>📝 Total Questions</div>
                              </div>
                              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.3)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>{Math.round((answeredCount / qList.length) * 100)}%</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>⏱️ Completion</div>
                              </div>
                            </div>

                            {unansweredCount > 0 && (
                              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.84rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
                                ⚠️ You have <strong>{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</strong>. You can go back and answer them, or submit now.
                              </div>
                            )}
                          </div>

                          {/* Per-Question Status Grid */}
                          <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.9rem' }}>Question-by-Question Status</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {qList.map((q, idx) => {
                                const ans = savedAnswers[idx]
                                const isAnswered = !!(ans && String(ans).trim())
                                const typeLabel = q.type === 'mcq' ? '🎯 MCQ' : q.type === 'fillup' ? '✏️ Fill-up' : q.type === 'problem' ? '💻 Problem' : '📝 Conceptual'
                                const preview = isAnswered ? String(ans).slice(0, 60) + (String(ans).length > 60 ? '...' : '') : null
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.75rem',
                                      padding: '0.65rem 0.9rem',
                                      borderRadius: '8px',
                                      background: isAnswered ? 'rgba(16, 185, 129, 0.07)' : 'rgba(245, 158, 11, 0.06)',
                                      border: isAnswered ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                      setCurrentQIdx(idx)
                                      setUserAnswerText(savedAnswers[idx] || (q?.type === 'problem' ? (q.starterCode || '') : ''))
                                      setShowReviewPanel(false)
                                    }}
                                  >
                                    {/* Number bubble */}
                                    <div style={{
                                      width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                                      background: isAnswered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                                      color: isAnswered ? '#10b981' : '#f59e0b',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem'
                                    }}>
                                      {isAnswered ? '✓' : idx + 1}
                                    </div>

                                    {/* Question info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Q{idx + 1}: {q.question?.slice(0, 70)}{q.question?.length > 70 ? '...' : ''}
                                      </div>
                                      {preview && (
                                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          Your answer: "{preview}"
                                        </div>
                                      )}
                                    </div>

                                    {/* Type + status badge */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{typeLabel}</span>
                                      <span style={{
                                        fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px',
                                        background: isAnswered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: isAnswered ? '#10b981' : '#f59e0b'
                                      }}>
                                        {isAnswered ? 'Answered' : 'Not Answered'}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Final Action Buttons */}
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              className="btn-secondary"
                              onClick={() => setShowReviewPanel(false)}
                              style={{ padding: '10px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                              <ArrowLeft size={16} />
                              <span>Back — Answer More</span>
                            </button>
                            <button
                              className="btn-solid-blue"
                              onClick={handleFinishInterview}
                              style={{ padding: '12px 32px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)' }}
                            >
                              <span>✅ Confirm & Submit Quiz</span>
                              <ArrowRight size={16} />
                            </button>
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
                          {(sessionQuestions.length > 0 ? sessionQuestions : (interviewQuestions[interviewDomain] || [])).map((q, idx) => (
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
            {activeTab === 'job-recommendations' && (() => {
              const jobPostings = [
                {
                  id: 1,
                  title: "Machine Learning Engineer",
                  company: "Google",
                  logoText: "G",
                  logoBg: "#ea4335",
                  location: "Bangalore, India (Hybrid)",
                  salary: "₹28,00,000 - ₹38,00,000 / yr",
                  fitScore: 94,
                  fitColor: "#10b981",
                  type: "Full-time • Campus & Lateral",
                  skills: ["Python", "PyTorch", "Kubernetes", "MLOps", "TensorFlow"],
                  description: "Build scalable ML models and real-time distributed inference pipelines for Search & Assistant."
                },
                {
                  id: 2,
                  title: "Senior Backend Developer",
                  company: "Microsoft",
                  logoText: "M",
                  logoBg: "#00a4ef",
                  location: "Hyderabad, India (On-site)",
                  salary: "₹24,00,000 - ₹34,00,000 / yr",
                  fitScore: 89,
                  fitColor: "#2563eb",
                  type: "Full-time • Tech Lead Track",
                  skills: ["Python", "Distributed Systems", "SQL", "Docker", "Azure"],
                  description: "Design high-throughput microservices and resilient cloud APIs handling 100M+ requests daily."
                },
                {
                  id: 3,
                  title: "Cloud Solutions Architect",
                  company: "Amazon AWS",
                  logoText: "A",
                  logoBg: "#ff9900",
                  location: "Mumbai, India (Hybrid)",
                  salary: "₹22,00,000 - ₹30,00,000 / yr",
                  fitScore: 85,
                  fitColor: "#6366f1",
                  type: "Full-time • Cloud Infrastructure",
                  skills: ["AWS", "Terraform", "Kubernetes", "Linux", "CI/CD"],
                  description: "Architect multi-region, zero-downtime cloud infrastructure and disaster recovery pipelines."
                },
                {
                  id: 4,
                  title: "AI Research Associate",
                  company: "Meta",
                  logoText: "M",
                  logoBg: "#0668e1",
                  location: "Remote (India)",
                  salary: "₹20,00,000 - ₹28,00,000 / yr",
                  fitScore: 82,
                  fitColor: "#ec4899",
                  type: "Full-time • Applied Research",
                  skills: ["Python", "Transformers", "NLP", "PyTorch", "Research"],
                  description: "Investigate frontier LLM attention architectures, parameter efficiency, and multimodal reasoning."
                },
                {
                  id: 5,
                  title: "Lead Data Analyst",
                  company: "Flipkart",
                  logoText: "F",
                  logoBg: "#2874f0",
                  location: "Bangalore, India (On-site)",
                  salary: "₹18,00,000 - ₹25,00,000 / yr",
                  fitScore: 88,
                  fitColor: "#10b981",
                  type: "Full-time • E-Commerce Analytics",
                  skills: ["SQL", "Power BI", "Tableau", "Python", "A/B Testing"],
                  description: "Model customer purchase funnels, pricing elasticity, and inventory forecasting using big data."
                },
                {
                  id: 6,
                  title: "Technical Product Manager",
                  company: "Zomato",
                  logoText: "Z",
                  logoBg: "#cb202d",
                  location: "Gurgaon, India (Hybrid)",
                  salary: "₹22,00,000 - ₹32,00,000 / yr",
                  fitScore: 81,
                  fitColor: "#f59e0b",
                  type: "Full-time • Logistics Tech",
                  skills: ["Product Strategy", "Roadmapping", "Agile", "SQL", "User Research"],
                  description: "Lead driver routing algorithms and customer ETA prediction features end-to-end with engineering."
                }
              ]

              return (
                <div>
                  <div className="welcome-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h2>AI Job Recommendations & Placement Drives</h2>
                        <p>Curated tech opportunities ranked by skill match & employer database schema (PDF Page 8)</p>
                      </div>
                      <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        6 Matching Openings
                      </span>
                    </div>
                  </div>

                  <div className="dash-2col">
                    {jobPostings.map((job) => (
                      <div key={job.id} className="white-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: job.logoBg, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.15rem' }}>
                                {job.logoText}
                              </div>
                              <div>
                                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{job.title}</h4>
                                <span style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 600 }}>{job.company}</span>
                              </div>
                            </div>
                            <span className="match-badge" style={{ background: `${job.fitColor}22`, color: job.fitColor, border: `1px solid ${job.fitColor}44`, fontWeight: 700 }}>
                              {job.fitScore}% Fit
                            </span>
                          </div>

                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                            {job.description}
                          </p>

                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {job.skills.map((skill, sIdx) => (
                              <span key={sIdx} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#cbd5e1' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.85rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📍 {job.location}</div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10b981' }}>{job.salary}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setActiveTab('skill-gap-analysis')}>
                              Check Fit
                            </button>
                            <button className="btn-solid-blue" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => alert(`Application submitted for ${job.title} at ${job.company}! Your verified skills were forwarded.`)}>
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* 3. SKILL ASSESSMENT */}
            {activeTab === 'skill-assessment' && (
              <div className="skill-assessment-container">
                <div className="welcome-header">
                  <h2>Adaptive Skill Assessment & Verified Badge Engine</h2>
                  <p>Interactive timed diagnostics to validate technical competencies and earn official blockchain-verifiable badges</p>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
                    1. VERIFIED BADGES SHOWCASE SHELF
                   ═══════════════════════════════════════════════════════════════════ */}
                <div className="white-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          Your Verified Skill Badges
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                          Earned by scoring 70%+ in rigorous timed diagnostics • Recognized by CareerCast partner recruiters
                        </p>
                      </div>
                    </div>
                    <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {verifiedBadges.length} Competencies Certified ★
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {verifiedBadges.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          padding: '1.2rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                          border: `1.5px solid ${b.badgeColor}40`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: `0 8px 24px ${b.badgeColor}15`,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '-15px',
                          right: '-15px',
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: `${b.badgeColor}15`,
                          filter: 'blur(10px)',
                          pointerEvents: 'none'
                        }} />

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
                              <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                                  {b.title}
                                </h4>
                                <span style={{ fontSize: '0.72rem', color: b.badgeColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  {b.level} Level • {b.score}% Score
                                </span>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <CheckCircle2 size={11} /> Verified
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                            {b.skills.map((sk, skIdx) => (
                              <span key={skIdx} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                                ✓ {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                          <span>ID: {b.verifiedHash}</span>
                          <span style={{ color: '#94a3b8' }}>Issued: {b.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
                    2. ASSESSMENT STEP: CATEGORY SELECTOR VIEW
                   ═══════════════════════════════════════════════════════════════════ */}
                {assessmentStep === 'selector' && (
                  <div className="white-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                        Choose Assessment Category to Certify
                      </h3>
                      <p className="panel-sub" style={{ margin: 0 }}>
                        Select a domain track. Complete the 5 questions within 5 minutes. Score 70% or higher to automatically generate and unlock your official Verified Skill Badge.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      {Object.values(assessmentCategories).map((cat) => {
                        const isSelected = selectedAssessmentCategory === cat.id
                        const alreadyEarned = verifiedBadges.some(b => b.category === cat.id)
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setSelectedAssessmentCategory(cat.id)}
                            style={{
                              padding: '1.25rem',
                              borderRadius: '12px',
                              background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-card)',
                              border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease',
                              boxShadow: isSelected ? `0 8px 20px ${cat.color}25` : 'none'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                                {alreadyEarned && (
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                                    ★ Badge Earned
                                  </span>
                                )}
                              </div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                                {cat.title}
                              </h4>
                              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
                                {cat.description}
                              </p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#cbd5e1' }}>
                              <span>⏱️ {cat.duration}</span>
                              <span style={{ color: cat.color, fontWeight: 700 }}>Pass: {cat.passingScore}%+</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className="btn-solid-blue"
                        onClick={() => {
                          setAssessUserAnswers({})
                          setCurrentAssessQIdx(0)
                          setAssessTimeLeft(300)
                          setAssessTimerActive(true)
                          setAssessmentStep('quiz')
                        }}
                        style={{
                          padding: '12px 36px',
                          fontSize: '1rem',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)'
                        }}
                      >
                        <span>Start {assessmentCategories[selectedAssessmentCategory]?.title} Test</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════════
                    3. ASSESSMENT STEP: LIVE QUIZ INTERACTION
                   ═══════════════════════════════════════════════════════════════════ */}
                {assessmentStep === 'quiz' && (() => {
                  const currentCategory = assessmentCategories[selectedAssessmentCategory]
                  const qList = currentCategory?.questions || []
                  const currQ = qList[currentAssessQIdx]
                  const selectedOpt = assessUserAnswers[currentAssessQIdx]

                  return (
                    <div>
                      {/* Top Bar with Category, Progress and Timer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <button
                          onClick={() => setAssessmentStep('selector')}
                          style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}
                        >
                          <ArrowLeft size={18} />
                          <span>Quit to Categories</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '0.82rem', color: currentCategory.color, fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', background: `${currentCategory.color}20` }}>
                            {currentCategory.icon} {currentCategory.title}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.88rem', fontWeight: 700 }}>
                            <Clock size={15} />
                            <span>05:00 Timed Track</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Questions Grid */}
                      <div className="white-panel" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                            Question {currentAssessQIdx + 1} of {qList.length}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {Object.keys(assessUserAnswers).length} of {qList.length} Answered
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${((currentAssessQIdx + 1) / qList.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #38bdf8)', transition: 'width 0.3s ease' }} />
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="white-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <span className="match-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                            Competency Diagnostic
                          </span>
                          <span className="match-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                            Pass Threshold: 70%
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                          {currQ.q}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                          {currQ.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setAssessUserAnswers(prev => ({ ...prev, [currentAssessQIdx]: optIdx }))}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.85rem',
                                  padding: '14px 16px',
                                  borderRadius: '10px',
                                  background: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'var(--bg-card)',
                                  border: isSelected ? '2px solid #2563eb' : '1px solid var(--border)',
                                  color: isSelected ? '#ffffff' : '#cbd5e1',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontSize: '0.92rem',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <span style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  background: isSelected ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  flexShrink: 0
                                }}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span style={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                                {isSelected && <Check size={18} color="#38bdf8" />}
                              </button>
                            )
                          })}
                        </div>

                        {/* Navigation Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            className="sidebar-logout-btn"
                            disabled={currentAssessQIdx === 0}
                            onClick={() => setCurrentAssessQIdx(prev => Math.max(0, prev - 1))}
                            style={{ width: 'auto', padding: '9px 20px', opacity: currentAssessQIdx === 0 ? 0.4 : 1 }}
                          >
                            ← Previous
                          </button>

                          {currentAssessQIdx < qList.length - 1 ? (
                            <button
                              className="btn-solid-blue"
                              onClick={() => setCurrentAssessQIdx(prev => prev + 1)}
                              style={{ padding: '9px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <span>Next Question</span>
                              <ArrowRight size={16} />
                            </button>
                          ) : (
                            <button
                              className="btn-solid-blue"
                              onClick={() => {
                                // Calculate score
                                let correctCount = 0
                                qList.forEach((q, idx) => {
                                  if (assessUserAnswers[idx] === q.correct) {
                                    correctCount += 1
                                  }
                                })
                                const scorePct = Math.round((correctCount / qList.length) * 100)
                                const passed = scorePct >= currentCategory.passingScore

                                // If passed and badge not already earned, award badge!
                                if (passed && !verifiedBadges.some(b => b.category === currentCategory.id)) {
                                  const newBadge = {
                                    id: `badge-${currentCategory.id}`,
                                    category: currentCategory.id,
                                    title: `${currentCategory.title.split('&')[0].trim()} Certified`,
                                    level: scorePct >= 90 ? 'Advanced' : 'Intermediate',
                                    score: scorePct,
                                    date: 'Nov 2026',
                                    badgeColor: currentCategory.color,
                                    icon: currentCategory.icon,
                                    verifiedHash: `CC-${currentCategory.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
                                    skills: ['Verified Diagnostics', 'Core Foundations', 'Problem Solving']
                                  }
                                  setVerifiedBadges(prev => [newBadge, ...prev])
                                }

                                setLastAssessResult({
                                  category: currentCategory,
                                  score: scorePct,
                                  correctCount,
                                  total: qList.length,
                                  passed
                                })
                                setAssessmentStep('result')
                              }}
                              style={{ background: 'linear-gradient(135deg, #10b981, #2563eb)', padding: '10px 28px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                            >
                              <span>Submit & Calculate Grade</span>
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* ═══════════════════════════════════════════════════════════════════
                    4. ASSESSMENT STEP: RESULTS & BADGE UNLOCK VIEW
                   ═══════════════════════════════════════════════════════════════════ */}
                {assessmentStep === 'result' && lastAssessResult && (
                  <div className="white-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      background: lastAssessResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: lastAssessResult.passed ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      border: `2px solid ${lastAssessResult.passed ? '#10b981' : '#ef4444'}`
                    }}>
                      {lastAssessResult.passed ? <Award size={44} /> : <XCircle size={44} />}
                    </div>

                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                      {lastAssessResult.passed ? 'Congratulations! Badge Unlocked!' : 'Assessment Complete — Keep Practicing!'}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 1.5rem', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
                      {lastAssessResult.passed
                        ? `You scored ${lastAssessResult.score}% in ${lastAssessResult.category.title}, surpassing the ${lastAssessResult.category.passingScore}% passing threshold. Your official Verified Skill Badge has been issued and linked to your candidate profile.`
                        : `You scored ${lastAssessResult.score}%. The passing threshold is ${lastAssessResult.category.passingScore}%. Review the explanations below and re-test anytime to earn your badge.`}
                    </p>

                    {/* Score summary cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lastAssessResult.passed ? '#10b981' : '#f59e0b' }}>
                          {lastAssessResult.score}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Overall Score</div>
                      </div>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
                          {lastAssessResult.correctCount} / {lastAssessResult.total}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Correct Answers</div>
                      </div>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lastAssessResult.passed ? '#10b981' : '#ef4444' }}>
                          {lastAssessResult.passed ? 'PASSED' : 'RETRY'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Diagnostic Status</div>
                      </div>
                    </div>

                    {/* Review Explanations */}
                    <div style={{ textAlign: 'left', maxWidth: '750px', margin: '0 auto 2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                        Detailed Answer Review & Rationale
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {lastAssessResult.category.questions.map((q, idx) => {
                          const userAns = assessUserAnswers[idx]
                          const isCorrect = userAns === q.correct
                          return (
                            <div key={idx} style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: isCorrect ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Q{idx + 1}: {q.q}</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                                  {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0' }}>
                                Correct Answer: <strong style={{ color: '#e2e8f0' }}>{q.options[q.correct]}</strong>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                💡 {q.explanation}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => setAssessmentStep('selector')}
                        style={{ padding: '10px 24px', borderRadius: '9999px' }}
                      >
                        ← Back to Categories
                      </button>
                      <button
                        className="btn-solid-blue"
                        onClick={() => {
                          setAssessUserAnswers({})
                          setCurrentAssessQIdx(0)
                          setAssessmentStep('quiz')
                        }}
                        style={{ padding: '10px 26px', borderRadius: '9999px' }}
                      >
                        Retake Assessment
                      </button>
                      {lastAssessResult.passed && (
                        <button
                          className="btn-solid-blue"
                          onClick={() => setActiveTab('certifications')}
                          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '10px 26px', borderRadius: '9999px' }}
                        >
                          View in Certifications →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 10. MY PROGRESS (EXACT RECREATION OF TEACHER'S PANEL 4) */}
            {activeTab === 'my-progress' && (() => {
              // ── Compute live stats from interviewHistory ──
              const hist = interviewHistory
              const totalInterviews = hist.length
              const avgScore = totalInterviews > 0
                ? Math.round(hist.reduce((s, h) => s + h.score, 0) / totalInterviews)
                : 0
              const bestScore = totalInterviews > 0 ? Math.max(...hist.map(h => h.score)) : 0
              const improvement = totalInterviews >= 2
                ? hist[hist.length - 1].score - hist[0].score
                : 0

              // ── SVG chart: map each session to an x point ──
              const chartW = 400, chartH = 150, padL = 40, padR = 20, padT = 20, padB = 30
              const innerW = chartW - padL - padR
              const innerH = chartH - padT - padB
              // y: score 0–100 maps to innerH→0 (top=100%)
              const toY = (score) => padT + innerH - (score / 100) * innerH
              const toX = (idx) => padL + (hist.length <= 1 ? innerW / 2 : (idx / (hist.length - 1)) * innerW)

              const pts = hist.map((h, i) => `${toX(i)},${toY(h.score)}`).join(' ')
              const areaFirst = `${toX(0)},${chartH - padB}`
              const areaLast  = `${toX(hist.length - 1)},${chartH - padB}`
              const areaPoints = `${areaFirst} ${pts} ${areaLast}`

              return (
              <div>
                <div className="welcome-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <BarChart3 size={22} color="#3b82f6" />
                    <h2 style={{ margin: 0 }}>Interview Performance Dashboard</h2>
                  </div>
                  <p>Historical trends, competency growth, and recommended learning pathways</p>
                </div>

                {/* ── Top 4 Live Stat Tiles ── */}
                <div className="interview-stats-grid">
                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc' }}>
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val">{totalInterviews}</div>
                      <div className="interview-stat-tile-lbl">Total Interviews</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                      <Star size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val">{avgScore}%</div>
                      <div className="interview-stat-tile-lbl">Average Score</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val" style={{ color: improvement >= 0 ? '#38bdf8' : '#f87171' }}>
                        {improvement >= 0 ? '+' : ''}{improvement}%
                      </div>
                      <div className="interview-stat-tile-lbl">Improvement</div>
                    </div>
                  </div>

                  <div className="interview-stat-tile">
                    <div className="interview-stat-icon-wrap" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <div className="interview-stat-tile-val" style={{ color: '#f59e0b' }}>{bestScore}%</div>
                      <div className="interview-stat-tile-lbl">Best Score</div>
                    </div>
                  </div>
                </div>

                {/* ── Middle: Dynamic SVG Chart + Recommended Topics ── */}
                <div className="dash-2col" style={{ marginBottom: '1.5rem' }}>
                  <div className="white-panel" style={{ padding: '1.5rem' }}>
                    <div className="panel-header" style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Performance Trend</h3>
                      <span className="match-badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                        {improvement >= 0 ? '↑ Upward Trajectory' : '↓ Needs Focus'}
                      </span>
                    </div>

                    {totalInterviews === 0 ? (
                      <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem', fontSize: '0.9rem' }}>
                        Complete your first interview session to see your trend chart here!
                      </div>
                    ) : (
                      <div style={{ position: 'relative', height: '200px', width: '100%', marginTop: '0.5rem' }}>
                        <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="trendGradient2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid lines */}
                          {[100, 75, 50, 25, 0].map(pct => (
                            <g key={pct}>
                              <line x1={padL} y1={toY(pct)} x2={chartW - padR} y2={toY(pct)}
                                stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                              <text x={padL - 6} y={toY(pct) + 4} fill="#64748b" fontSize="9" textAnchor="end">{pct}%</text>
                            </g>
                          ))}

                          {/* Baseline */}
                          <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB}
                            stroke="rgba(255,255,255,0.1)" />

                          {/* Area fill */}
                          {hist.length > 1 && (
                            <polygon points={areaPoints} fill="url(#trendGradient2)" />
                          )}

                          {/* Trend line */}
                          {hist.length > 1 && (
                            <polyline fill="none" stroke="#3b82f6" strokeWidth="3"
                              strokeLinecap="round" strokeLinejoin="round" points={pts} />
                          )}

                          {/* Data points + labels */}
                          {hist.map((h, i) => {
                            const cx = toX(i), cy = toY(h.score)
                            const isLast = i === hist.length - 1
                            const labelY = cy - 14
                            return (
                              <g key={i}>
                                <circle cx={cx} cy={cy} r={isLast ? 6 : 5}
                                  fill={isLast ? '#10b981' : '#3b82f6'} stroke="#070e28" strokeWidth="2" />
                                <rect x={cx - 18} y={labelY - 10} width="36" height="16" rx="4"
                                  fill={isLast ? '#2563eb' : '#1e293b'} />
                                <text x={cx} y={labelY + 2} fill="#ffffff" fontSize="9"
                                  fontWeight="700" textAnchor="middle">{h.score}%</text>
                                <text x={cx} y={chartH - padB + 14} fill="#94a3b8" fontSize="9"
                                  textAnchor="middle">#{i + 1}</text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    )}
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
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    <button className="btn-solid-blue" onClick={() => setActiveTab('learning-path')}
                      style={{ padding: '10px 20px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}>
                      <BookOpen size={16} />
                      <span>Start Learning Path →</span>
                    </button>
                  </div>
                </div>

                {/* ── Previous Interviews — live from interviewHistory ── */}
                <div className="white-panel" style={{ padding: '1.5rem' }}>
                  <div className="panel-header" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#38bdf8" />
                      <span>All Interview Sessions ({totalInterviews})</span>
                    </h3>
                    <span className="match-badge" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>Live Data</span>
                  </div>

                  {totalInterviews === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      No sessions yet — complete an interview to see results here!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {[...interviewHistory].reverse().map((row, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '95px' }}>{row.date}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{row.domain}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="match-badge" style={{ background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}44`, fontWeight: 700 }}>
                              {row.score}%
                            </span>
                            <span style={{ fontSize: '0.78rem', color: row.color, fontWeight: 600 }}>{row.status}</span>
                            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => setActiveTab('interview-preparation')}>
                              Practice Again
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )
            })()}

            {/* 11. NOTIFICATIONS (JOB RECOMMENDATIONS & CAMPUS DRIVES) */}
            {activeTab === 'notifications' && (
              <div>
                <div className="welcome-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2>Job Recommendation & Placement Alerts</h2>
                      <p>Personalized employment alerts, high-affinity campus openings & recruitment drives</p>
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

                <div className="white-panel" style={{ maxWidth: '900px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1.1rem 1.25rem',
                          borderRadius: '10px',
                          background: notif.read ? 'var(--bg-card)' : 'rgba(37, 99, 235, 0.08)',
                          border: notif.read ? '1px solid var(--border)' : '1px solid rgba(37, 99, 235, 0.35)',
                          transition: 'all 0.2s ease',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: `${notif.fitColor || '#38bdf8'}22`,
                          color: notif.fitColor || '#38bdf8',
                          border: `1px solid ${notif.fitColor || '#38bdf8'}44`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Briefcase size={20} />
                        </div>

                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{notif.title}</h4>
                              {notif.fit && (
                                <span className="match-badge" style={{ background: `${notif.fitColor}22`, color: notif.fitColor, border: `1px solid ${notif.fitColor}44`, fontSize: '0.72rem', padding: '2px 8px' }}>
                                  {notif.fit}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{notif.time}</span>
                          </div>

                          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{notif.desc}</p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📍 {notif.location}</span>
                            <button
                              className="btn-pill-outline"
                              onClick={() => setActiveTab('job-recommendations')}
                              style={{ padding: '3px 12px', fontSize: '0.75rem', borderColor: notif.fitColor, color: notif.fitColor }}
                            >
                              View in Job Recommendations →
                            </button>
                          </div>
                        </div>

                        {!notif.read && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px', flexShrink: 0 }} />
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
