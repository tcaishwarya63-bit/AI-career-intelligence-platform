from setuptools import setup, find_packages

setup(
    name="careercast-ai",
    version="1.0.0",
    author="Aishwarya T C",
    author_email="tcaishwarya63@gmail.com",
    description="AI-Powered Career Intelligence & Path Prediction Platform (SIH 2025)",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "fastapi>=0.110.0",
        "uvicorn>=0.28.0",
        "scikit-learn>=1.4.0",
        "xgboost>=2.0.0",
        "pandas>=2.2.0",
        "numpy>=1.26.0",
        "spacy>=3.7.0",
        "pypdf>=4.0.0",
        "joblib>=1.3.0",
        "python-multipart>=0.0.9"
    ],
    extras_require={
        "dev": ["pytest>=8.0.0", "httpx>=0.27.0"]
    },
    entry_points={
        "console_scripts": [
            "careercast=ml.server:main"
        ]
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    python_requires=">=3.9",
)
