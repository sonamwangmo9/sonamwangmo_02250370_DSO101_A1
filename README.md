https://github.com/sonamwangmo9/sonamwangmo_02250370_DSO101_A1.git
# Todo App - CI/CD Assignment (DSO101)

## Live Deployment
https://todo-app-wche.onrender.com/health

## Steps Taken
1. Used existing Node.js Todo app with PostgreSQL backend
2. Verified Dockerfile in the backend folder
3. Created GitHub Actions workflow (.github/workflows/deploy.yml)
4. Set up DockerHub repository and generated access token
5. Added GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, RENDER_DEPLOY_HOOK)
6. Created Render.com web service using existing Docker image
7. Added environment variables to Render
8. Pushed code - GitHub Actions automatically built, pushed and deployed!

## Challenges Faced
- Docker image was not found on Render until we manually pushed it first
- App showed "Cannot GET /" because the backend is an API with no root route
- Had to add database environment variables to Render separately

## Learning Outcomes
- Learned how to containerize a Node.js app using Docker
- Learned how GitHub Actions automates the build and deploy process
- Learned how to push Docker images to DockerHub
- Learned how to deploy using Render.com with existing images
- Learned how to store secrets safely in GitHub