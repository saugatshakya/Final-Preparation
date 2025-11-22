# Full Stack App Development Exam Preparation

This directory is organized to help you prepare for your final exam. Each major topic is split into theory and practical/code sections for focused study.

## Structure
- testing/
- web_service/
- spa/
- devops/
- react/
- express/
- node/
- angular/
- llm_function_calling/

Each topic contains:
- theory/: Detailed notes, concepts, code examples, sample Q&A
- practical/: Step-by-step instructions, code snippets, full examples, exam tasks

## How to Use
- Start with theory to understand concepts (refer to slides in each topic)
- Practice with code samples and exercises in practical/
- Review past questions and professor's hints in practical/
- Use the sample Q&A for quick revision

## Topics Covered
- Testing: Unit, Integration, E2E testing with examples
- RESTful Web Service: API design, middleware, models, CRUD operations
- SPA: Single Page Applications, routing, state management, conditional rendering
- DevOps: CI/CD, Docker, deployment, automation
- React: Components, hooks, routing, authentication, context API
- Express: Routing, middleware, models, error handling
- Node.js: Event loop, modules, file operations, streams
- Angular: Components, routing, guards, dependency injection, unit testing
- LLM Function Calling: Integrating LLMs with function calling capabilities

## Practical Exam Hints
- Angular: Localstorage, Login/Register/Logout, *ngIf, Component creation, Routing, Guards, Unit Testing
- Backend: API endpoints, middleware, models, protecting endpoints, adding new models/schemas
- React: Localstorage, Login/Register/Logout, useState, useEffect, routing, protection, redirects
- Frontend: Conditional rendering (*ngIf, ternary, &&)

## Key Features
- Detailed code examples for each concept
- Sample exam questions and answers
- Common pitfalls and debugging tips
- Full working examples for complex scenarios
- Step-by-step implementation guides

## Study Plan
1. **Week 1:** Focus on theory notes for all topics (understand concepts)
2. **Week 2:** Practice with practical examples and code snippets
3. **Week 3:** Review sample Q&A and debugging tips
4. **Week 4:** Full mock exams using the practical tasks

## Exam Tips
- Focus on the professor's hints for practical questions
- Practice implementing the code patterns shown
- Understand the flow: frontend → API → backend → database
- Know how to add routes, middleware, and models
- Master authentication patterns in both Angular and React

## Quick Reference
- **Angular:** `ng g c ComponentName`, routes in `app.routes.ts`, guards with `canActivate`
- **React:** Hooks (`useState`, `useEffect`), routing with `react-router`
- **Express:** Routes in `routes/`, middleware in `middleware/`, models in `models/`
- **Testing:** Unit tests with Jasmine/Karma (Angular), Jest (React)

## Additional Resources
- Review your mockexam code for practical examples
- Check slides for diagrams and additional context
- Practice with Postman for API testing
- Use browser dev tools for frontend debugging

## Cheat Sheet

### Express.js
```js
// Basic server
const express = require('express');
const app = express();
app.use(express.json());

// Route
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Middleware
function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');
  next();
}

// Protected route
app.get('/api/protected', auth, (req, res) => {
  res.send('Protected data');
});

// Model
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('User', userSchema);
```

### Angular
```typescript
// Component
@Component({
  selector: 'app-user',
  template: `<h1>{{ title }}</h1>`
})
export class UserComponent {
  title = 'User Component';
}

// Service
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers() {
    return this.http.get('/api/users');
  }
}

// Guard
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return !!localStorage.getItem('token');
  }
}

// Route
{ path: 'users', component: UserComponent, canActivate: [AuthGuard] }
```

### React
```jsx
// Component
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Custom Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setStoredValue];
}

// Context
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Testing
```typescript
// Angular Unit Test
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

```jsx
// React Unit Test
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(screen.getByText('App')).toBeInTheDocument();
});
```

### DevOps
```yaml
# .gitlab-ci.yml
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
    - docker build -t myapp .
    - docker run -d myapp
```

```yaml
# docker-compose.yml
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
