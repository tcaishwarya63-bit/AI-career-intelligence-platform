"""
Historical Career Transitions Dataset Generator
Generates realistic career profiles with skills, education, and target roles
to train the baseline Logistic Regression model for CareerCast (Milestone 1).
"""

import pandas as pd
import numpy as np

def generate_career_dataset(num_samples=350, random_seed=42):
    np.random.seed(random_seed)
    
    # Career Roles and their characteristic skill distributions
    role_skill_pools = {
        'Data Scientist': {
            'core': ['python', 'machine learning', 'sql', 'statistics', 'pandas', 'scikit-learn'],
            'advanced': ['deep learning', 'pytorch', 'tensorflow', 'nlp', 'data visualization', 'aws', 'big data'],
            'degree': ['M.S. in Data Science', 'B.S. in Computer Science', 'M.Tech in AI', 'B.Tech in CS']
        },
        'Software Engineer': {
            'core': ['java', 'python', 'c++', 'data structures', 'algorithms', 'git', 'sql'],
            'advanced': ['react', 'node.js', 'docker', 'system design', 'microservices', 'kubernetes', 'rest api'],
            'degree': ['B.Tech in Computer Science', 'B.E. in IT', 'B.S. in Software Engineering', 'M.S. in CS']
        },
        'Business Analyst': {
            'core': ['excel', 'sql', 'power bi', 'tableau', 'business intelligence', 'data analysis'],
            'advanced': ['requirements gathering', 'agile', 'jira', 'financial modeling', 'stakeholder management'],
            'degree': ['B.B.A.', 'M.B.A.', 'B.Com in Analytics', 'B.Tech with Business Minor']
        },
        'Product Manager': {
            'core': ['product strategy', 'roadmapping', 'agile', 'scrum', 'user research', 'wireframing'],
            'advanced': ['jira', 'a/b testing', 'sql', 'market analysis', 'product lifecycle', 'kpis'],
            'degree': ['M.B.A.', 'B.Tech + MBA', 'B.S. in Information Systems']
        },
        'DevOps / Cloud Architect': {
            'core': ['linux', 'docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'],
            'advanced': ['bash', 'python', 'ansible', 'cloud security', 'monitoring', 'prometheus'],
            'degree': ['B.Tech in Cloud Computing', 'B.S. in Computer Systems', 'B.Tech in IT']
        }
    }
    
    data = []
    
    for role, specs in role_skill_pools.items():
        samples_per_role = num_samples // len(role_skill_pools)
        for _ in range(samples_per_role):
            # Pick 3 to 5 core skills
            num_core = np.random.randint(3, len(specs['core']) + 1)
            chosen_core = np.random.choice(specs['core'], size=num_core, replace=False).tolist()
            
            # Pick 1 to 4 advanced skills
            num_adv = np.random.randint(1, min(4, len(specs['advanced']) + 1))
            chosen_adv = np.random.choice(specs['advanced'], size=num_adv, replace=False).tolist()
            
            # Add occasional cross-domain skills (noise / interdisciplinary profiles)
            if np.random.rand() > 0.7:
                other_role = np.random.choice([r for r in role_skill_pools.keys() if r != role])
                noise_skill = np.random.choice(role_skill_pools[other_role]['core'], size=1).tolist()
            else:
                noise_skill = []
                
            skills = list(set(chosen_core + chosen_adv + noise_skill))
            skills_str = ', '.join(skills)
            
            degree = np.random.choice(specs['degree'])
            experience_years = np.random.randint(0, 8)
            
            data.append({
                'skills': skills_str,
                'degree': degree,
                'experience_years': experience_years,
                'target_role': role
            })
            
    df = pd.DataFrame(data)
    # Shuffle dataset
    df = df.sample(frac=1, random_state=random_seed).reset_index(drop=True)
    return df

if __name__ == '__main__':
    df = generate_career_dataset()
    print(f"Generated {len(df)} historical career transition records.")
    print("\nSample records:")
    print(df.head(3))
    print("\nRole distribution:")
    print(df['target_role'].value_counts())
