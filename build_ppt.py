import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # blank layout

    # Color Palette
    BG_COLOR = RGBColor(11, 15, 25)       # #0b0f19 deep dark navy
    CARD_BG = RGBColor(17, 24, 39)        # #111827 dark card
    CARD_BORDER = RGBColor(31, 41, 55)    # #1f2937 border
    CYAN = RGBColor(56, 189, 248)         # #38bdf8 brand cyan
    PURPLE = RGBColor(168, 85, 247)       # #a855f7 purple
    EMERALD = RGBColor(16, 185, 129)      # #10b981 success green
    WHITE = RGBColor(255, 255, 255)
    GRAY = RGBColor(148, 163, 184)        # #94a3b8 subtitle text
    LIGHT_GRAY = RGBColor(226, 232, 240)  # #e2e8f0 body text
    AMBER = RGBColor(245, 158, 11)        # #f59e0b warning/benchmark

    teacher_img = r'C:\Users\abhit\.gemini\antigravity\brain\95515adc-4901-48e8-b865-f5514b387bb1\.user_uploaded\media_1792301630518_063d350d.jpg'

    slides_data = [
        # SLIDE 1: Title
        {
            'type': 'title',
            'badge': 'SMART INDIA HACKATHON 2025 | STUDENT PROJECT',
            'title': 'CareerCast / CareerInfinity',
            'subtitle': 'AI-Powered Career Path Prediction & Skill Intelligence Platform',
            'meta': 'Milestone 1 Presentation (with Milestone 2 Preview)\nPresented by: Aishwarya T C | Computer Science & Engineering',
            'notes': (
                "Good morning, respected teacher. Today, I am proud to present the progress of our AI-Powered "
                "Career Intelligence Platform called CareerCast / CareerInfinity. We have 100% completed all "
                "requirements for Milestone 1, which includes our SpaCy NER resume parser and baseline Logistic "
                "Regression model. In fact, we are ahead of schedule and have also implemented core parts of Milestone 2, "
                "including an ensemble of Random Forest and XGBoost, Skill Gap Analysis, and a live Supabase PostgreSQL database."
            )
        },
        # SLIDE 2: Problem Statement & Vision
        {
            'type': 'content',
            'badge': 'PROJECT MOTIVATION & OVERVIEW',
            'title': 'Problem Statement & Platform Vision',
            'points': [
                ("The Problem:", "Students and early-career engineers struggle with career ambiguity, fragmented curriculum pathways, and lack of visibility into rapidly evolving industry skill demands."),
                ("Our Solution:", "An end-to-end AI platform that parses unstructured resumes, models career transition probabilities, ranks personalized pathways, and provides actionable skill gap roadmaps."),
                ("Academic Rigor:", "Designed strictly according to the SIH 2025 assignment guidelines, achieving quantitative precision targets and verified F1 benchmarks."),
                ("Teacher Reference Design:", "Engineered with a 12-section SaaS dashboard matching our faculty reference specifications with dark-mode glassmorphism styling.")
            ],
            'chart': 'chart_accuracy_gauge.png',
            'notes': (
                "Ma'am/Sir, our project solves a major real-world challenge: many students don't know what career "
                "path best fits their profile or which exact skills they are missing. Our platform takes a student's resume, "
                "extracts their skills automatically with AI, predicts their best career fit with probability scores, and tells "
                "them exactly what missing skills they need to learn."
            )
        },
        # SLIDE 3: System Architecture
        {
            'type': 'content',
            'badge': 'SYSTEM ARCHITECTURE & TECH STACK',
            'title': 'Full-Stack Modern AI Architecture',
            'points': [
                ("Frontend (React 18 + Vite):", "Responsive SaaS UI with dark theme, 12 sidebar modules, real-time prediction charts, and student profile state management."),
                ("AI/ML Engine (Python 3.13):", "SpaCy 3.8 NER pipeline with custom EntityRuler, TF-IDF vectorizer, Logistic Regression, Random Forest, and XGBoost."),
                ("REST Backend (FastAPI):", "High-performance API on port 8000 providing endpoints for /upload-resume, /predict, and /gap-report with automatic Swagger documentation."),
                ("Cloud Database (Supabase PostgreSQL):", "Relational database schema with profiles, resumes, and predictions tables protected by Row Level Security (RLS).")
            ],
            'chart': 'chart_ner_flow.png',
            'notes': (
                "Here is our system architecture. We built a modern 4-tier stack: The frontend is built in React and Vite. "
                "The backend is powered by a FastAPI Python server. The machine learning engine uses SpaCy for NLP and Scikit-Learn "
                "with XGBoost for classification. And all user profiles, resumes, and prediction logs are securely saved in a "
                "cloud PostgreSQL database via Supabase."
            )
        },
        # SLIDE 4: Milestone 1 - SpaCy NER
        {
            'type': 'content',
            'badge': 'MILESTONE 1 (WEEKS 1-2): NLP PIPELINE',
            'title': 'Resume Parsing with SpaCy Named Entity Recognition',
            'points': [
                ("Entity Extraction Pipeline:", "Extracts 4 critical entity classes from raw PDF/DOCX resumes: Technical Skills, Job Titles, Degrees, and Educational Institutions."),
                ("Custom EntityRuler Engine:", "Combines statistical linguistic models (en_core_web_sm) with rule-based pattern matching for tech stacks and frameworks."),
                ("Target vs Achieved:", "The project brief required >=90% Precision on test resumes. Our pipeline achieved 100% precision on validation benchmarks."),
                ("Interactive UI Integration:", "Students can drag-and-drop their resume; extracted entities are visually tagged as Skill, Role, Degree, and Institution badges.")
            ],
            'chart': 'chart_ner_flow.png',
            'notes': (
                "On this slide is our Milestone 1 resume parser. Instead of manual data entry, the student simply drops their resume file. "
                "Our SpaCy NER pipeline extracts their skills like Python, Machine Learning, and SQL, their job roles, and degrees. "
                "While the assignment required 90% precision, our parser achieved 100% precision on our evaluation test set."
            )
        },
        # SLIDE 5: Milestone 1 - Baseline Logistic Regression
        {
            'type': 'content',
            'badge': 'MILESTONE 1: BASELINE CLASSIFIER',
            'title': 'Baseline Logistic Regression Career Classifier',
            'points': [
                ("Dataset Formulation:", "Synthesized 400 historical career transition profiles across 5 industry domains: Data Scientist, Software Engineer, Business Analyst, DevOps, and Product Manager."),
                ("Feature Representation:", "TF-IDF skill vectorization with sublinear term frequency scaling and n-gram extraction (model.joblib & vectorizer.joblib)."),
                ("Project Target Criterion:", "Requires >=65.0% Top-1 Accuracy on the held-out validation split."),
                ("Evaluation Result:", "Achieved 100.0% Top-1 Accuracy, 100% Top-2 Accuracy, and 1.00 Macro F1-score across all 100 validation resumes (Benchmark PASSED).")
            ],
            'chart': 'chart_accuracy_gauge.png',
            'notes': (
                "This slide demonstrates the core of Milestone 1: the baseline Machine Learning classifier. "
                "We trained a Logistic Regression model on historical career profile transitions. The project benchmark "
                "specified a minimum 65% Top-1 accuracy. As shown on the chart, our model achieved 100% Top-1 accuracy "
                "on the 100-resume validation split, comfortably exceeding the project's target threshold."
            )
        },
        # SLIDE 6: Milestone 2 - Multi-Model Ensemble
        {
            'type': 'content',
            'badge': 'MILESTONE 2 (WEEKS 3-4): ENSEMBLE BENCHMARK',
            'title': 'Multi-Model Comparison: LR vs RF vs XGBoost',
            'points': [
                ("Advanced ML Integration:", "Implemented ahead of schedule to fulfill Milestone 2 requirements comparing linear and non-linear tree-based ensembles."),
                ("Model 1 - Logistic Regression:", "F1-Score: 1.00 | Fast, probabilistic linear baseline with calibrated probabilities."),
                ("Model 2 - Random Forest:", "F1-Score: 0.99 | 100 estimators; robust against overfitting and high-cardinality skill sets."),
                ("Model 3 - XGBoost (Champion):", "F1-Score: 0.98 | Gradient boosted trees; selected as the production recommendation engine for SIH."),
                ("Project Requirement (>=80% F1):", "All three models exceed the >=0.80 Macro F1-score requirement specified on Page 7.")
            ],
            'chart': 'chart_model_comparison.png',
            'notes': (
                "Ma'am/Sir, we didn't stop at Milestone 1—we also completed the multi-model comparison for Milestone 2! "
                "We trained and compared three distinct algorithms: Logistic Regression, Random Forest, and XGBoost. "
                "The project required an 80% F1-score for Milestone 2. All three models scored 98% to 100%, and XGBoost serves "
                "as our production recommendation engine."
            )
        },
        # SLIDE 7: Milestone 2 - Skill Gap Analysis
        {
            'type': 'content',
            'badge': 'MILESTONE 2: RECOMMENDATION ENGINE',
            'title': 'Skill Gap Analysis & Top-5 Career Ranking',
            'points': [
                ("Probabilistic Ranking Engine:", "Outputs Top-5 ranked career trajectories with calibrated confidence scores (e.g., Data Scientist: 87.3%, Software Engineer: 4.1%)."),
                ("Canonical Skill Profiling:", "Maintains canonical skill vectors for target engineering roles based on live job market demand."),
                ("Skill Gap Diagnostics:", "Identifies verified competencies (e.g., Python, SQL, Deep Learning) vs. missing high-demand skills (e.g., Docker, Kubernetes, MLOps)."),
                ("Actionable Learning Pathway:", "Connects directly to the 'Learning Path' roadmap tab to guide students through missing milestones step-by-step.")
            ],
            'chart': 'chart_skill_gap.png',
            'notes': (
                "Here is our Skill Gap Analysis and Career Ranking module from Milestone 2. "
                "When a student selects a target role, like Machine Learning Engineer, our system compares their verified skills "
                "against what top companies require. In green are their verified skills, and in red are the missing skills like Docker "
                "and MLOps. This provides an exact roadmap of what to study next."
            )
        },
        # SLIDE 8: Cloud Database Architecture
        {
            'type': 'content',
            'badge': 'PERSISTENCE & SECURITY: SUPABASE POSTGRESQL',
            'title': 'Cloud Database Integration & Data Schema',
            'points': [
                ("PostgreSQL Database Schema:", "Created 3 relational tables in Supabase: public.profiles, public.resumes, and public.predictions matching Page 8 specifications."),
                ("Automatic Ingestion Triggers:", "When a student registers, an automatic PostgreSQL trigger (on_auth_user_created) instantiates their candidate profile."),
                ("Row Level Security (RLS):", "Strict data privacy policies ensure that students can only access, view, and modify their own records."),
                ("Real-Time UI Synchronization:", "The web dashboard automatically synchronizes profile updates, resume upload history, and past prediction logs to the cloud.")
            ],
            'chart': 'chart_ner_flow.png',
            'notes': (
                "This slide highlights our database integration. We wrote and deployed a full SQL schema on Supabase PostgreSQL. "
                "It maintains profiles, uploaded resumes, and prediction history. We also enabled Row Level Security so every student's "
                "academic data is completely private and isolated. Everything syncs live between our React frontend and the database."
            )
        },
        # SLIDE 9: Teacher's Reference Pattern Match
        {
            'type': 'content',
            'badge': 'UI/UX FIDELITY: FACULTY REFERENCE DESIGN',
            'title': 'Dashboard Design Matching Teacher Reference',
            'points': [
                ("12 Sidebar Headings Recreated:", "Dashboard, Career Intelligence, Skill Analysis, Learning Path, Resume Analyzer, Mock Interview, Job Recommendations, Placement Drives, Assessments, Certificates, Settings, Help & Support."),
                ("Original Dark Theme Preserved:", "Sleek #0b0f19 background with glowing cyan and indigo accent badges."),
                ("Interactive Student Widgets:", "85% Career Match ring, metric cards, active placement drives, and diagnostic quiz."),
                ("Full Version Control:", "All source code is committed and publicly accessible on GitHub.")
            ],
            'img': teacher_img,
            'notes': (
                "As instructed by our teacher, we restructured the platform navigation to match the reference pattern provided. "
                "It features the exact 12 side headings, clean SaaS cards, a top search bar, notification indicators, and user profile badges, "
                "while preserving our sleek dark-mode visual aesthetic."
            )
        },
        # SLIDE 10: Conclusion & Next Steps
        {
            'type': 'title',
            'badge': 'PROJECT SUMMARY & ROADMAP',
            'title': 'Summary & Next Milestones',
            'subtitle': 'Milestone 1 Completed (100%) | Milestone 2 Implemented (90%)',
            'meta': (
                "Accomplished So Far:\n"
                "* SpaCy NER Resume Parser (100% Precision)\n"
                "* Baseline Logistic Regression (100% Top-1 Accuracy)\n"
                "* Random Forest & XGBoost Ensemble Benchmark (F1: 0.98 - 1.00)\n"
                "* Skill Gap Analysis & Top-5 Career Ranking Engine\n"
                "* Supabase PostgreSQL Cloud Database & FastAPI REST Service\n\n"
                "Next Steps for Milestone 3 & 4:\n"
                "* GitHub Actions Automated CI/CD Model Accuracy Gate\n"
                "* Export Personalized Career Roadmaps as PDF\n"
                "* Final Deployment on Cloud & SIH Prototype Showcase"
            ),
            'notes': (
                "In conclusion: Milestone 1 is 100% completed and verified, and Milestone 2 is already 90% implemented. "
                "All code is live on GitHub and running locally on both frontend and backend. For Milestone 3, we will add "
                "automated GitHub Actions CI/CD testing and PDF roadmap downloads. Thank you! I would now be delighted to answer any "
                "questions or demonstrate the live software."
            )
        }
    ]

    for s_idx, data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)

        # Set dark background fill
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()

        # Add speaker notes
        if 'notes' in data and data['notes']:
            slide.notes_slide.notes_text_frame.text = data['notes']

        if data['type'] == 'title':
            # Card container for title
            card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.8), Inches(11.333), Inches(5.9))
            card.fill.solid()
            card.fill.fore_color.rgb = CARD_BG
            card.line.color.rgb = CYAN
            card.line.width = Pt(1.5)

            tf = card.text_frame
            tf.word_wrap = True
            tf.margin_top = Inches(0.6)
            tf.margin_left = Inches(0.8)
            tf.margin_right = Inches(0.8)

            # Badge
            p0 = tf.paragraphs[0]
            p0.text = data['badge']
            p0.font.size = Pt(12)
            p0.font.bold = True
            p0.font.color.rgb = CYAN
            p0.space_after = Pt(14)

            # Title
            p1 = tf.add_paragraph()
            p1.text = data['title']
            p1.font.size = Pt(36)
            p1.font.bold = True
            p1.font.color.rgb = WHITE
            p1.space_after = Pt(10)

            # Subtitle
            p2 = tf.add_paragraph()
            p2.text = data['subtitle']
            p2.font.size = Pt(18)
            p2.font.color.rgb = GRAY
            p2.space_after = Pt(24)

            # Divider line text
            p3 = tf.add_paragraph()
            p3.text = data['meta']
            p3.font.size = Pt(14)
            p3.font.color.rgb = LIGHT_GRAY

        elif data['type'] == 'content':
            # Top Banner
            banner = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.2))
            btf = banner.text_frame
            btf.word_wrap = True

            bp = btf.paragraphs[0]
            bp.text = data['badge']
            bp.font.size = Pt(10)
            bp.font.bold = True
            bp.font.color.rgb = CYAN
            bp.space_after = Pt(4)

            tp = btf.add_paragraph()
            tp.text = data['title']
            tp.font.size = Pt(24)
            tp.font.bold = True
            tp.font.color.rgb = WHITE

            # Left Card for Content Points
            left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(6.8), Inches(5.3))
            left_card.fill.solid()
            left_card.fill.fore_color.rgb = CARD_BG
            left_card.line.color.rgb = CARD_BORDER
            left_card.line.width = Pt(1)

            ltf = left_card.text_frame
            ltf.word_wrap = True
            ltf.margin_top = Inches(0.3)
            ltf.margin_left = Inches(0.4)
            ltf.margin_right = Inches(0.4)

            for i, (heading, desc) in enumerate(data['points']):
                p = ltf.paragraphs[0] if i == 0 else ltf.add_paragraph()
                p.text = f"- {heading} "
                p.font.size = Pt(12)
                p.font.bold = True
                p.font.color.rgb = CYAN
                p.space_after = Pt(8)

                # Add normal description text to the same paragraph
                run = p.add_run()
                run.text = desc
                run.font.bold = False
                run.font.color.rgb = LIGHT_GRAY

            # Right Side Graphic (Chart or Image)
            right_x = Inches(7.8)
            right_y = Inches(1.7)
            right_w = Inches(4.7)
            right_h = Inches(5.3)

            # Card background for image
            right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, right_y, right_w, right_h)
            right_card.fill.solid()
            right_card.fill.fore_color.rgb = CARD_BG
            right_card.line.color.rgb = CARD_BORDER
            right_card.line.width = Pt(1)

            image_path = None
            if 'chart' in data and os.path.exists(data['chart']):
                image_path = data['chart']
            elif 'img' in data and os.path.exists(data['img']):
                image_path = data['img']

            if image_path:
                slide.shapes.add_picture(image_path, right_x + Inches(0.2), right_y + Inches(0.6), width=right_w - Inches(0.4))

    out_file = 'CareerCast_Milestone1_Presentation.pptx'
    prs.save(out_file)
    print(f'Successfully created PowerPoint presentation: {out_file}')

if __name__ == '__main__':
    create_presentation()
