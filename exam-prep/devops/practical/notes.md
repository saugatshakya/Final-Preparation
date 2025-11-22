# DevOps Practical Notes

## 1. CI/CD Pipeline
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

## 2. Dockerfile
### Example:
```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

## 3. docker-compose.yml
### Example:
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

## 4. Common Pitfalls
- Incorrect YAML syntax in .gitlab-ci.yml
- Not handling build failures
- Exposing secrets in code

## 5. Debugging Tips
- Check GitLab CI/CD logs
- Test Docker builds locally
- Use environment variables for secrets

## 6. Sample Exam Tasks
- Write a CI/CD pipeline for build/test/deploy
- Write a Dockerfile for your app
- Use docker-compose.yml for multi-service setup
- Configure environment variables

## 7. Full Example: Complete Pipeline
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: myapp:$CI_COMMIT_REF_SLUG

build:
  stage: build
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
  only:
    - main

test:
  stage: test
  script:
    - docker run $DOCKER_IMAGE npm test
  only:
    - main

deploy:
  stage: deploy
  script:
    - docker-compose up -d
  environment:
    name: production
  only:
    - main
```

```yaml
# docker-compose.yml
version: '3'
services:
  web:
    image: myapp:main
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=$DATABASE_URL
  db:
    image: mongo
    ports:
      - "27017:27017"
```

---
Refer to your codebase and slides for more examples.
