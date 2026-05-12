# Assignment 4 - Deploy Your First Web App
**Course:** DSO101 - Continuous Integration and Continuous Deployment  
**Student:** Sonam Wangmo  
**Student ID:** 02250370  

## What This Project Does
A simple Flask web app that returns "Hello DevOps!" when you visit the URL. It is automatically deployed using GitHub Actions and Render.

## Tools Used
- Python Flask
- GitHub Actions
- Render

## Steps I Followed

### 1. Created the Flask App
- Created `app.py` with a simple Flask route
- Created `requirements.txt` with flask and gunicorn

### 2. Pushed Code to GitHub
- Used git commands to push all files to GitHub

### 3. Set Up GitHub Actions
- Created `.github/workflows/deploy.yml`
- Workflow runs automatically every time code is pushed to main branch

### 4. Deployed on Render
- Connected GitHub repo to Re