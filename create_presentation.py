import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# ── Color Palette (Dark Tech / Teacher-Aligned) ──
BG_DARK = RGBColor(11, 17, 32)        # Deep Navy / Charcoal (#0B1120)
CARD_BG = RGBColor(26, 38, 64)        # Elevated Surface (#1A2640)
CARD_BORDER = RGBColor(56, 189, 248)  # Sky Blue (#38BDF8)
TEXT_WHITE = RGBColor(255, 255, 255)  # Crisp White
TEXT_MUTED = RGBColor(148, 163, 184)  # Slate Gray (#94A3B8)
BLUE_ACCENT = RGBColor(37, 99, 235)   # Royal Blue (#2563EB)
CYAN_ACCENT = RGBColor(56, 189, 248)  # Bright Cyan (#38BDF8)
GREEN_ACCENT = RGBColor(16, 185, 129) # Emerald Green (#10B981)
AMBER_ACCENT = RGBColor(245, 158, 11) # Amber (#F59E0B)
RED_ACCENT = RGBColor(239, 68, 68)    # Coral Red (#EF4444)

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_DARK

def add_header(slide, category, title, subtitle=None):
    # Category tag
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = category.upper()
    p_c.font.size = Pt(10)
    p_c.font.bold = True
    p_c.font.color.rgb = CYAN_ACCENT

    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.6))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

    # Subtitle
    if subtitle:
        s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.45))
        tf_s = s_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.size = Pt(12)
        p_s.font.color.rgb = TEXT_MUTED

def add_card(slide, left, top, width, height, title=None, border_color=None, bg_color=CARD_BG):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.fill.background()
    
    if title:
        t_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.4))
        p = t_box.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
    return shape

def create_deck(filename="CareerCast_Milestone_3_Presentation.pptx"):
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 1: Title Slide (Matches Uploaded Reference Image Exactly)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Left content box
    left_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(7.5), Inches(5.5))
    tf1 = left_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "AI Powered career\nintelligence platform"
    p0.font.size = Pt(28)
    p0.font.bold = True
    p0.font.color.rgb = TEXT_WHITE
    p0.space_after = Pt(20)

    p1 = tf1.add_paragraph()
    p1.text = "Milestone 3: Skill Gap Analysis, API & CI Integration"
    p1.font.size = Pt(20)
    p1.font.bold = True
    p1.font.color.rgb = CYAN_ACCENT
    p1.space_after = Pt(12)

    p2 = tf1.add_paragraph()
    p2.text = "From automated API microservices and continuous integration to teacher-aligned interview simulation and intelligent skill-gap quantification."
    p2.font.size = Pt(13)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_after = Pt(30)

    p3 = tf1.add_paragraph()
    p3.text = "Presented by:"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = TEXT_WHITE
    p3.space_after = Pt(8)

    team = [
        "Anuradha Kumari",
        "Chilaka Deekshita",
        "Aishwarya TC",
        "Arpita",
        "Aryan Tomar",
        "Aadya Sharma"
    ]
    for m in team:
        pm = tf1.add_paragraph()
        pm.text = f"•   {m}"
        pm.font.size = Pt(12)
        pm.font.color.rgb = RGBColor(226, 232, 240)
        pm.space_after = Pt(3)

    # Right visual card (mimicking the winding pathway visual from reference image)
    right_card = add_card(s1, Inches(8.8), Inches(1.2), Inches(3.6), Inches(5.2), border_color=BLUE_ACCENT)
    v_box = s1.shapes.add_textbox(Inches(9.0), Inches(1.6), Inches(3.2), Inches(4.5))
    v_tf = v_box.text_frame
    v_tf.word_wrap = True

    vp1 = v_tf.paragraphs[0]
    vp1.text = "🎯 Core Architecture"
    vp1.font.size = Pt(16)
    vp1.font.bold = True
    vp1.font.color.rgb = CYAN_ACCENT
    vp1.space_after = Pt(16)

    bullets = [
        "FastAPI REST Microservice Hub",
        "Canonical Skill Gap Quantification (72%)",
        "Teacher 12-Heading Standardized Navigation",
        "3-Panel Timed Interview Preparation",
        "Shuffled 80-Question Knowledge Banks",
        "Real-Time 'My Progress' Performance Curve",
        "Automated CI/CD 14-Test Regression Suite"
    ]
    for b in bullets:
        bp = v_tf.add_paragraph()
        bp.text = f"✔  {b}"
        bp.font.size = Pt(11)
        bp.font.color.rgb = RGBColor(203, 213, 225)
        bp.space_after = Pt(8)

    # =========================================================================
    # SLIDE 2: Teacher-Requested UI Architecture & Sidebar Redesign
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "System Architecture & UI Evolution", "Comprehensive UI Overhaul Based on Teacher Feedback",
               "Transformed the platform layout to strictly match the 12-heading reference design provided by the teacher.")

    # 3 Column cards
    # Col 1: 12 Sidebar Headings
    c1 = add_card(s2, Inches(0.8), Inches(1.9), Inches(3.8), Inches(5.1), "12 Standardized Headings", border_color=BLUE_ACCENT)
    t1 = s2.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(3.4), Inches(4.4))
    tf_c1 = t1.text_frame
    tf_c1.word_wrap = True
    headings = [
        "1. Dashboard", "2. My Profile", "3. Skill Assessment",
        "4. Career Recommendations", "5. Job Recommendations", "6. Learning Path",
        "7. Resume Analyzer", "8. Interview Preparation", "9. Skill Gap Analysis",
        "10. My Progress", "11. Notifications", "12. Settings"
    ]
    for h in headings:
        p = tf_c1.add_paragraph() if tf_c1.paragraphs[0].text else tf_c1.paragraphs[0]
        p.text = f"•  {h}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_WHITE
        p.space_after = Pt(4)

    # Col 2: Brand & Visual Redesign
    c2 = add_card(s2, Inches(4.9), Inches(1.9), Inches(3.8), Inches(5.1), "Teacher Brand Guidelines", border_color=CYAN_ACCENT)
    t2 = s2.shapes.add_textbox(Inches(5.1), Inches(2.4), Inches(3.4), Inches(4.4))
    tf_c2 = t2.text_frame
    tf_c2.word_wrap = True
    b_items = [
        ("Brand Icon", "Blue rounded GraduationCap badge replacing generic brain icon."),
        ("Brand Name", "'AI Powered' / 'Career Intelligence Platform' typography."),
        ("Active State", "Teacher-matched solid blue pill indicator with white icon."),
        ("Logout Footer", "Bottom-anchored outlined pill logout button with confirmation."),
        ("Theme System", "Unified #0B0F19 canvas with #111827 card surfaces.")
    ]
    for title, desc in b_items:
        p = tf_c2.add_paragraph() if tf_c2.paragraphs[0].text else tf_c2.paragraphs[0]
        p.text = f"✔ {title}: "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = CYAN_ACCENT
        p.add_run().text = desc
        p.runs[1].font.bold = False
        p.runs[1].font.size = Pt(10)
        p.runs[1].font.color.rgb = TEXT_MUTED
        p.space_after = Pt(8)

    # Col 3: Teacher-Aligned Architectural Benefits
    c3 = add_card(s2, Inches(9.0), Inches(1.9), Inches(3.6), Inches(5.1), "Architectural Impact", border_color=GREEN_ACCENT)
    t3 = s2.shapes.add_textbox(Inches(9.2), Inches(2.4), Inches(3.2), Inches(4.4))
    tf_c3 = t3.text_frame
    tf_c3.word_wrap = True
    impacts = [
        "100% layout fidelity to teacher's benchmark image.",
        "Zero orphan routes: every feature accessible from primary sidebar.",
        "Smooth state management with automated reset triggers.",
        "Direct visual connection between Assessment, Interview Prep, and Progress tracking."
    ]
    for imp in impacts:
        p = tf_c3.add_paragraph() if tf_c3.paragraphs[0].text else tf_c3.paragraphs[0]
        p.text = f"★ {imp}"
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 3: Milestone 3 Core — Intelligent Skill Gap Analysis Engine
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Milestone 3: Competency Quantification", "Canonical Skill Gap Analysis & 72% Alignment Calibration",
               "Quantifying the exact competency delta between candidate profile and target industry role taxonomy.")

    # Left: Algorithm & Formula
    add_card(s3, Inches(0.8), Inches(1.9), Inches(5.6), Inches(5.1), "Taxonomy & Mathematical Framework", border_color=BLUE_ACCENT)
    t_f = s3.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(5.2), Inches(4.2))
    tf_f = t_f.text_frame
    tf_f.word_wrap = True

    p = tf_f.paragraphs[0]
    p.text = "Mathematical Alignment Formula:"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = CYAN_ACCENT

    p_f2 = tf_f.add_paragraph()
    p_f2.text = "Alignment % = (|Verified Skills ∩ Canonical Requirements| / |Canonical Requirements|) * 100"
    p_f2.font.size = Pt(10.5)
    p_f2.font.color.rgb = GREEN_ACCENT
    p_f2.space_after = Pt(12)

    notes = [
        "Canonical Taxonomy: Grounded on standardized O*NET 240+ occupation descriptions and curated LinkedIn skill matrices.",
        "Deterministic Scoring: Eliminates subjective intuition with mathematical relevance scores.",
        "Dynamic Target Selection: Dropdown enables instant calibration for Machine Learning Engineer, Data Scientist, Cloud Architect, or Product Manager."
    ]
    for n in notes:
        pn = tf_f.add_paragraph()
        pn.text = f"•  {n}"
        pn.font.size = Pt(10.5)
        pn.font.color.rgb = TEXT_MUTED
        pn.space_after = Pt(8)

    # Right: Live Localhost UI Representation
    add_card(s3, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.1), "Localhost UI: Machine Learning Engineer", border_color=GREEN_ACCENT)
    t_ui = s3.shapes.add_textbox(Inches(7.0), Inches(2.4), Inches(5.3), Inches(4.4))
    tf_ui = t_ui.text_frame
    tf_ui.word_wrap = True

    p_g = tf_ui.paragraphs[0]
    p_g.text = "✔ Verified Acquired Skills (Green Chips):"
    p_g.font.bold = True
    p_g.font.size = Pt(11.5)
    p_g.font.color.rgb = GREEN_ACCENT
    p_g.space_after = Pt(4)

    p_g_val = tf_ui.add_paragraph()
    p_g_val.text = "Python  •  SQL  •  PyTorch  •  Data Visualization  •  Machine Learning"
    p_g_val.font.size = Pt(10.5)
    p_g_val.font.color.rgb = TEXT_WHITE
    p_g_val.space_after = Pt(12)

    p_r = tf_ui.add_paragraph()
    p_r.text = "✕ Missing for Target Role (Red Chips):"
    p_r.font.bold = True
    p_r.font.size = Pt(11.5)
    p_r.font.color.rgb = RED_ACCENT
    p_r.space_after = Pt(4)

    p_r_val = tf_ui.add_paragraph()
    p_r_val.text = "Kubernetes  •  MLOps Pipeline Deployment  •  AWS SageMaker  •  System Design"
    p_r_val.font.size = Pt(10.5)
    p_r_val.font.color.rgb = TEXT_WHITE
    p_r_val.space_after = Pt(16)

    p_bar = tf_ui.add_paragraph()
    p_bar.text = "Target Role Alignment Bar (Localhost Metric):"
    p_bar.font.bold = True
    p_bar.font.size = Pt(11.5)
    p_bar.font.color.rgb = CYAN_ACCENT

    p_bar_val = tf_ui.add_paragraph()
    p_bar_val.text = "████████████████████░░░░░░░░  72%  (Missing 4 competencies)"
    p_bar_val.font.size = Pt(12)
    p_bar_val.font.bold = True
    p_bar_val.font.color.rgb = GREEN_ACCENT
    p_bar_val.space_after = Pt(12)

    p_bridge = tf_ui.add_paragraph()
    p_bridge.text = "Actionable Bridge: Recommends curated Docker, MLOps, and SageMaker hands-on projects directly in the Learning Path roadmap."
    p_bridge.font.size = Pt(10)
    p_bridge.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 4: Milestone 3 Core — Production FastAPI REST Ecosystem
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Milestone 3: Backend Services & API", "Production FastAPI REST Ecosystem & Interactive OpenAPI",
               "High-performance asynchronous endpoints exposed on localhost:8000/docs for real-time inference.")

    # 4 Cards for Endpoints
    endpoints = [
        ("POST /predict", "Candidate Career Trajectory", CYAN_ACCENT,
         "Accepts structured skill list or raw resume text. Runs TF-IDF vectorization through multiclass classifier; outputs probability distribution across 5 career archetypes within 45ms."),
        ("POST /recommend", "Ranked Recommendations & Market Signals", BLUE_ACCENT,
         "Blends raw classifier probabilities with real-time market demand multipliers (e.g., ML Engineer * 1.15). Outputs Top-K ranked paths with confidence intervals (±2.5%)."),
        ("POST /gap-report", "Skill Delta & Missing Competencies", GREEN_ACCENT,
         "Compares candidate skill set against canonical taxonomy. Returns alignment percentage, matching skills, and missing prerequisites for target role."),
        ("POST /upload-resume", "PDF/DOCX Ingestion & SpaCy NER", AMBER_ACCENT,
         "Receives resume uploads, extracts text via PyPDF, runs through SpaCy NER entity ruler for skills, roles, and universities, and triggers instant prediction pipeline.")
    ]

    for idx, (ep, title, color, desc) in enumerate(endpoints):
        row = idx // 2
        col = idx % 2
        l = Inches(0.8 + col * 6.0)
        t = Inches(1.9 + row * 2.5)
        add_card(s4, l, t, Inches(5.7), Inches(2.3), f"{ep} — {title}", border_color=color)
        t_box = s4.shapes.add_textbox(l + Inches(0.2), t + Inches(0.65), Inches(5.3), Inches(1.5))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = RGBColor(226, 232, 240)

    # =========================================================================
    # SLIDE 5: Automated CI/CD Pipeline & Quality Gate Testing
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Model Governance & DevOps", "Automated CI/CD Regression Suite & Accuracy Gates",
               "Enforcing strict automated accuracy thresholds, NER precision gates, and frontend build validation on every push.")

    # Left: CI/CD Architecture
    add_card(s5, Inches(0.8), Inches(1.9), Inches(5.5), Inches(5.1), "GitHub Actions CI Pipeline (.github/workflows)", border_color=BLUE_ACCENT)
    t_ci = s5.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(5.1), Inches(4.3))
    tf_ci = t_ci.text_frame
    tf_ci.word_wrap = True

    ci_steps = [
        ("1. Environment Provisioning", "Python 3.11 & 3.13 matrix runners with automated caching."),
        ("2. Dependency Installation", "Installs FastAPI, scikit-learn, XGBoost, SpaCy en_core_web_sm."),
        ("3. Model Top-1 Accuracy Gate", "Automated test enforces >=65% threshold (Actual: 100% on validation split)."),
        ("4. SpaCy NER Precision Gate", "Enforces >=90% entity extraction precision on holdout resume tests."),
        ("5. REST Contract Verification", "Validates HTTP 200/400 contracts on all FastAPI endpoints."),
        ("6. Frontend Bundle Verification", "Executes 'npm run build' to ensure zero bundle/syntax regressions.")
    ]
    for step, desc in ci_steps:
        p = tf_ci.add_paragraph() if tf_ci.paragraphs[0].text else tf_ci.paragraphs[0]
        p.text = f"✔ {step}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = CYAN_ACCENT
        p.add_run().text = desc
        p.runs[1].font.size = Pt(9.5)
        p.runs[1].font.color.rgb = TEXT_MUTED
        p.space_after = Pt(6)

    # Right: Test Results Summary
    add_card(s5, Inches(6.7), Inches(1.9), Inches(5.8), Inches(5.1), "Pytest Suite Results (14 of 14 Passed ✅)", border_color=GREEN_ACCENT)
    t_ts = s5.shapes.add_textbox(Inches(6.9), Inches(2.5), Inches(5.4), Inches(4.3))
    tf_ts = t_ts.text_frame
    tf_ts.word_wrap = True

    p = tf_ts.paragraphs[0]
    p.text = "Regression Test Suite Breakdown:"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(8)

    test_rows = [
        ("tests/test_model.py (4 Tests)", "Top-1 Accuracy >= 65%, Probability Sum = 1.0, Vectorizer Transform, Artifact Integrity.", GREEN_ACCENT),
        ("tests/test_ner.py (4 Tests)", "Skill Extraction, Degree & Role Identification, Institution Extraction, Precision >= 90%.", GREEN_ACCENT),
        ("tests/test_api.py (6 Tests)", "Root Health '/', POST /predict, Empty Payload 400, POST /gap-report, POST /recommend, GET /model-registry.", GREEN_ACCENT)
    ]
    for suite, desc, col in test_rows:
        ps = tf_ts.add_paragraph()
        ps.text = f"✔ {suite}"
        ps.font.bold = True
        ps.font.size = Pt(11)
        ps.font.color.rgb = col
        pd = tf_ts.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED
        pd.space_after = Pt(8)

    # =========================================================================
    # SLIDE 6: MLflow Model Registry & Ensemble Optimization
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Machine Learning Engine", "MLflow Model Registry & Production Ensemble Benchmarks",
               "Multi-model optimization transitioning from baseline logistic regression to champion XGBoost ensemble.")

    # 3 Comparison Columns
    models = [
        ("Logistic Regression (v1 Baseline)", "0.65", "66%", "Archived",
         "Baseline linear model with L2 regularization (C=1.5). Fast inference but limited on non-linear interdisciplinary career boundaries.", RED_ACCENT),
        ("Random Forest (Bagging)", "0.75", "78%", "Candidate",
         "100 decision trees bagging ensemble. Stronger feature split handling across diverse skill vectors but higher memory footprint.", AMBER_ACCENT),
        ("XGBoost Ensemble (v2 Champion ★)", "0.82 ★", "94%", "Production ★",
         "Gradient boosted tree ensemble with cross-validated hyperparameter optimization. Met target F1 >= 0.80 threshold. Active in production.", GREEN_ACCENT)
    ]

    for idx, (m_name, f1, acc, status, desc, col) in enumerate(models):
        l = Inches(0.8 + idx * 4.0)
        card = add_card(s6, l, Inches(1.9), Inches(3.8), Inches(5.1), m_name, border_color=col)
        t_box = s6.shapes.add_textbox(l + Inches(0.2), Inches(2.5), Inches(3.4), Inches(4.3))
        tf = t_box.text_frame
        tf.word_wrap = True

        p_f1 = tf.paragraphs[0]
        p_f1.text = f"Macro F1-Score: {f1}"
        p_f1.font.bold = True
        p_f1.font.size = Pt(13)
        p_f1.font.color.rgb = col
        p_f1.space_after = Pt(4)

        p_acc = tf.add_paragraph()
        p_acc.text = f"Top-1/Top-5 Metric: {acc}"
        p_acc.font.size = Pt(11)
        p_acc.font.color.rgb = TEXT_WHITE
        p_acc.space_after = Pt(4)

        p_st = tf.add_paragraph()
        p_st.text = f"MLflow Status: {status}"
        p_st.font.bold = True
        p_st.font.size = Pt(11)
        p_st.font.color.rgb = col
        p_st.space_after = Pt(12)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 7: Teacher-Aligned Interview Preparation: 3-Panel Architecture
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Simulation Suite (Teacher Requirement)", "3-Panel Mock Interview Console & AI Evaluation",
               "Faithfully replicating the teacher's 3-panel architecture for realistic domain placement practice.")

    panels = [
        ("Panel 1: Hero & Domain Selection", CYAN_ACCENT, [
            "Hero Banner: 'Ace Your Interview with AI Guidance! Practice • Evaluate • Improve'.",
            "4 Domain Cards: Technical Interview, HR Interview, Aptitude Test, Coding Interview.",
            "Summary Stat Tiles: 3 Interviews Taken, 78% Avg Score, Top Skill, Focus Area.",
            "CTA: 'Start Practice →' launches active simulation."
        ]),
        ("Panel 2: Active Timed Practice Screen", BLUE_ACCENT, [
            "Progress Tracker: Question 1 of 20 with dynamic percentage completion bar.",
            "Countdown Timer: Active 00:04:45 timer with automatic time tracking.",
            "Contextual Hints: Expandable clue accordions for guided problem-solving.",
            "Live Textarea: Multi-line answer workspace with Prev/Next question navigation."
        ]),
        ("Panel 3: AI Evaluation Results", GREEN_ACCENT, [
            "Radial 80% Gauge: SVG circular score with 'Excellent Performance!' tier.",
            "4 Competency Bars: Technical Knowledge 85%, Answer Accuracy 80%, Communication 75%, Concept Understanding 80%.",
            "Actionable Feedback: Automated Strengths & Areas to Improve callouts.",
            "Expert Model Solution: Reference answer toggle for peer benchmarking."
        ])
    ]

    for idx, (p_title, col, bullets) in enumerate(panels):
        l = Inches(0.8 + idx * 4.0)
        add_card(s7, l, Inches(1.9), Inches(3.8), Inches(5.1), p_title, border_color=col)
        t_box = s7.shapes.add_textbox(l + Inches(0.2), Inches(2.6), Inches(3.4), Inches(4.2))
        tf = t_box.text_frame
        tf.word_wrap = True
        for b_idx, b in enumerate(bullets):
            p = tf.add_paragraph() if b_idx > 0 else tf.paragraphs[0]
            p.text = f"•  {b}"
            p.font.size = Pt(10)
            p.font.color.rgb = RGBColor(226, 232, 240)
            p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 8: 20-Question Shuffled Banks & Localhost Lifecycle Bug Fix
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Algorithm Engineering & Bug Resolution", "80-Question Knowledge Banks & State Desynchronization Fix",
               "Expanding question pools with Fisher-Yates randomization and resolving critical state caching on localhost.")

    # Left: Question Banks
    add_card(s8, Inches(0.8), Inches(1.9), Inches(5.7), Inches(5.1), "20 Verified Questions / Domain (80 Total)", border_color=BLUE_ACCENT)
    t_qb = s8.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(5.3), Inches(4.3))
    tf_qb = t_qb.text_frame
    tf_qb.word_wrap = True

    domains = [
        ("Technical Interview (20 Qs)", "Python internals, OOP inheritance, ACID transactions, horizontal vs vertical scaling, HTTP status codes, B-Trees, microservices, SQL injection prevention."),
        ("HR Behavioral (20 Qs)", "STAR conflict resolution, 5-year career goals, failure handling, leadership initiative, remote work self-discipline, salary negotiation, ethical dilemmas."),
        ("Aptitude & Reasoning (20 Qs)", "Parallel worker processing rates, profit/loss %, train speed-distance-time, dice probability, clock angles, syllogisms, Venn diagrams."),
        ("Coding Challenges (20 Qs)", "Two Sum hash map, string reversal, Fibonacci DP, binary search, BFS level order, DFS cycle detection, Kadane's algorithm, Dijkstra shortest path.")
    ]
    for d_name, d_desc in domains:
        p = tf_qb.add_paragraph() if tf_qb.paragraphs[0].text else tf_qb.paragraphs[0]
        p.text = f"✔ {d_name}: "
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = CYAN_ACCENT
        p.add_run().text = d_desc
        p.runs[1].font.size = Pt(9.5)
        p.runs[1].font.color.rgb = TEXT_MUTED
        p.space_after = Pt(6)

    # Right: Fisher-Yates & Bug Fix
    add_card(s8, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.1), "Fisher-Yates Shuffle & Localhost State Fix", border_color=GREEN_ACCENT)
    t_fx = s8.shapes.add_textbox(Inches(7.0), Inches(2.5), Inches(5.3), Inches(4.3))
    tf_fx = t_fx.text_frame
    tf_fx.word_wrap = True

    p = tf_fx.paragraphs[0]
    p.text = "1. Fisher-Yates Randomization Engine:"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = GREEN_ACCENT
    p.space_after = Pt(2)

    p_fy = tf_fx.add_paragraph()
    p_fy.text = "On every 'Start Practice' click, the 20-question bank is randomly shuffled. Candidates encounter a distinct sequence every session, preventing memorization."
    p_fy.font.size = Pt(9.5)
    p_fy.font.color.rgb = TEXT_MUTED
    p_fy.space_after = Pt(12)

    p_b = tf_fx.add_paragraph()
    p_b.text = "2. Localhost State Desynchronization Fix (Teacher Bug):"
    p_b.font.bold = True
    p_b.font.size = Pt(11)
    p_b.font.color.rgb = RED_ACCENT
    p_b.space_after = Pt(2)

    p_desc = tf_fx.add_paragraph()
    p_desc.text = "Problem: After an interview finished, sessionFinished=true but interviewActive stayed true. This caused Panels 1 & 2 to stay hidden permanently, showing only Panel 3."
    p_desc.font.size = Pt(9.5)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.space_after = Pt(6)

    p_sol = tf_fx.add_paragraph()
    p_sol.text = "Solution: Added setInterviewActive(false) in handleFinishInterview() and implemented a dedicated useEffect tab-switch reset hook that restores clean initial state upon navigating to Interview Preparation."
    p_sol.font.size = Pt(9.5)
    p_sol.font.color.rgb = GREEN_ACCENT

    # =========================================================================
    # SLIDE 9: My Progress Performance Dashboard (Teacher's Panel 4)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Growth Tracking & Analytics", "Real-Time 'My Progress' Dashboard & SVG Trend Line",
               "Continuous historical tracking and competency calibration directly tied to live interview outcomes.")

    # 4 Top Stat Boxes
    stats = [
        ("Total Interviews", "3 Sessions", CYAN_ACCENT),
        ("Average Score", "78%", GREEN_ACCENT),
        ("Improvement Index", "+12% Growth", BLUE_ACCENT),
        ("Best All-Time Score", "90% Benchmark", AMBER_ACCENT)
    ]
    for idx, (label, val, col) in enumerate(stats):
        l = Inches(0.8 + idx * 3.0)
        add_card(s9, l, Inches(1.9), Inches(2.8), Inches(1.3), border_color=col)
        tb = s9.shapes.add_textbox(l + Inches(0.15), Inches(2.0), Inches(2.5), Inches(1.1))
        tf = tb.text_frame
        p_v = tf.paragraphs[0]
        p_v.text = val
        p_v.font.bold = True
        p_v.font.size = Pt(18)
        p_v.font.color.rgb = col
        p_l = tf.add_paragraph()
        p_l.text = label
        p_l.font.size = Pt(9.5)
        p_l.font.color.rgb = TEXT_MUTED

    # Bottom Left: Dynamic Trend Line Card
    add_card(s9, Inches(0.8), Inches(3.4), Inches(6.8), Inches(3.6), "Dynamic Performance Trend Curve (SVG)", border_color=BLUE_ACCENT)
    t_tr = s9.shapes.add_textbox(Inches(1.0), Inches(3.9), Inches(6.4), Inches(2.9))
    tf_tr = t_tr.text_frame
    tf_tr.word_wrap = True

    p = tf_tr.paragraphs[0]
    p.text = "Mathematical Score Progression Across Attempts:"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(8)

    p_pts = tf_tr.add_paragraph()
    p_pts.text = "• Attempt 1: 60% (Proficient)  ──→  • Attempt 2: 70% (Good)  ──→  • Attempt 3: 80% (Excellent ★)"
    p_pts.font.size = Pt(11)
    p_pts.font.bold = True
    p_pts.font.color.rgb = GREEN_ACCENT
    p_pts.space_after = Pt(12)

    p_feat = tf_tr.add_paragraph()
    p_feat.text = "Real-Time Synchronization: Rendered via dynamic SVG polyline and shaded blue gradient area (#2563eb). Every time a student submits an interview, the score automatically appends to history and recalculates the curve."
    p_feat.font.size = Pt(10)
    p_feat.font.color.rgb = TEXT_MUTED

    # Bottom Right: Previous Interviews Table
    add_card(s9, Inches(7.9), Inches(3.4), Inches(4.6), Inches(3.6), "Previous Interviews History", border_color=CYAN_ACCENT)
    t_hist = s9.shapes.add_textbox(Inches(8.1), Inches(3.9), Inches(4.2), Inches(2.9))
    tf_hist = t_hist.text_frame
    tf_hist.word_wrap = True

    hist_rows = [
        ("Nov 02, 2026", "Python Developer", "80%", GREEN_ACCENT),
        ("Oct 25, 2026", "Data Analyst", "72%", CYAN_ACCENT),
        ("Oct 18, 2026", "Web Developer", "68%", AMBER_ACCENT)
    ]
    for dt, role, sc, col in hist_rows:
        p = tf_hist.add_paragraph() if tf_hist.paragraphs[0].text else tf_hist.paragraphs[0]
        p.text = f"• {dt}  |  {role}  |  "
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MUTED
        run = p.add_run()
        run.text = f"{sc} (Reviewed)"
        run.font.bold = True
        run.font.color.rgb = col
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 10: Advanced Visual Analytics, CLI Tool & Production Delivery
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Production Completion & Artifacts", "Advanced Visual Analytics, Terminal CLI & Cloud Persistence",
               "Multi-dimensional career comparison, embedding visualizations, and terminal prediction execution.")

    # 4 Quadrants
    quads = [
        ("t-SNE Skill Embeddings Scatter", CYAN_ACCENT,
         "2D visualization of Sentence-BERT skill embeddings showing 6 clusters (Software Eng, Data Science, AI/ML, Product, Research, Finance) and highlighting 'Interdisciplinary Skillset Overlap'."),
        ("4-Axis Career Radar Comparison", BLUE_ACCENT,
         "Side-by-side benchmark of Data Scientist vs Product Manager across Coding (85% vs 40%), Statistics (92% vs 50%), Business Acumen (55% vs 90%), and Communication (65% vs 95%)."),
        ("Terminal CLI Tool ('careercast')", GREEN_ACCENT,
         "Engineered ml/cli.py supporting 'python -m ml.cli predict --profile user.json'. Returns formatted JSON prediction with confidence score and top skills matching spec."),
        ("Export Engine & Cloud Database", AMBER_ACCENT,
         "One-click 'Export to CSV' (careercast_career_report.csv) alongside clean printable PDF roadmaps. User profiles, resumes, and predictions synced with Supabase PostgreSQL cloud tables.")
    ]

    for idx, (title, col, desc) in enumerate(quads):
        row = idx // 2
        col_idx = idx % 2
        l = Inches(0.8 + col_idx * 6.0)
        t = Inches(1.9 + row * 2.5)
        add_card(s10, l, t, Inches(5.7), Inches(2.3), title, border_color=col)
        tb = s10.shapes.add_textbox(l + Inches(0.2), t + Inches(0.65), Inches(5.3), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(226, 232, 240)

    # Save deck
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
    prs.save(output_path)
    print(f"Presentation successfully generated at: {output_path}")

if __name__ == "__main__":
    create_deck()
