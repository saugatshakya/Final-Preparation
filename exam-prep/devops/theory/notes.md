# DevOps Theory Notes

## 1. Introduction

DevOps combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery.

## 2. CI/CD (Continuous Integration/Continuous Deployment)

Automates building, testing, and deploying code.

### Example: .gitlab-ci.yml

```yaml
stages:
	- build
	- test
	- deploy

build:
	script:
		- npm install
		- npm run build

test:
	script:
		- npm test

deploy:
	script:
		- echo "Deploying..."
```

## 3. Docker

Docker is a platform for developing, shipping, and running applications in containers.

### Example: Dockerfile

```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

### Example: docker-compose.yml

```yaml
version: '3'
services:
	web:
		build: .
		ports:
			- "3000:3000"
	db:
		image: mongo
		ports:
			- "27017:27017"
```

## 4. Deployment & Automation

- Use CI/CD pipelines for automated deployment
- Use Docker for consistent environments

## 5. GitLab CI/CD Stages

- Build: Compile and package application
- Test: Run automated tests
- Deploy: Deploy to staging/production

## 6. Environment Variables

Use environment variables for configuration.

### Example:

```yaml
deploy:
  script:
    - export NODE_ENV=production
    - npm start
```

## 7. Debugging Tips

- Check CI/CD pipeline logs for errors
- Test Docker builds locally first
- Verify environment variable configurations
- Review deployment scripts for syntax errors

## 8. Sample Exam Tasks

- Explain CI/CD concepts and benefits
- Describe Docker containers vs images
- Discuss deployment strategies
- Explain GitLab CI/CD pipeline stages

## 9. Useful Exam Patterns

- Write .gitlab-ci.yml for pipeline
- Write Dockerfile for app
- Use docker-compose.yml for multi-service setup

## 10. Sample Exam Q&A

**Q: What is CI/CD?**
A: Automated process for building, testing, and deploying code.

**Q: What is Docker?**
A: Platform for running applications in containers.

**Q: How do you define a CI/CD pipeline?**
A: Use .gitlab-ci.yml with stages, jobs, and scripts.

**Q: What is docker-compose?**
A: Tool for defining and running multi-container Docker applications.

---

Refer to your slides (CI_CD.pptx.pdf) for diagrams and more examples.
