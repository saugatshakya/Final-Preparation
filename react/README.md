# React Frontend Development Crash Course

This comprehensive guide covers React frontend development with authentication, routing, state management, and API integration.

## Prerequisites

- Node.js (version 16 or higher) installed
- npm (comes with Node.js) or yarn
- A code editor (VS Code recommended)
- Basic JavaScript knowledge

## Quick Start

```bash
npx create-react-app my-react-app
cd my-react-app
npm install react-router-dom axios
npm start
```

## Creating Your First Component

After running `npm start`, you'll see a basic React app. Let's create our first component.

**src/App.js** (this file should already exist):

```jsx
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello React!</h1>
        <p>This is my first React component.</p>
      </header>
    </div>
  );
}

export default App;
```

**What just happened:**

- `import React from 'react'` - imports React library
- `function App() { ... }` - defines a component as a function
- `return ( ... )` - returns JSX (HTML-like syntax)
- `export default App` - makes the component available to other files

## JSX and Props

JSX lets you write HTML-like code in JavaScript. Props are how you pass data to components.

**Creating a Welcome component:**

```jsx
// src/components/Welcome.jsx
import React from "react";

function Welcome(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to {props.location}</p>
    </div>
  );
}

export default Welcome;
```

**Using the Welcome component in App.js:**

```jsx
// src/App.js
import React from "react";
import Welcome from "./components/Welcome";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Welcome name="John" location="React World" />
      <Welcome name="Jane" location="JavaScript Land" />
    </div>
  );
}

export default App;
```

**Key Points:**

- Components start with capital letters
- Props are passed like HTML attributes
- `{props.name}` displays the prop value
- You can reuse components with different props

## Component State (Class Components)

State allows components to remember and update data. Let's start with class components.

**Counter Component:**

```jsx
// src/components/Counter.jsx
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
}

export default Counter;
```

**Using Counter in App.js:**

```jsx
// src/App.js
import React from "react";
import Welcome from "./components/Welcome";
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">
      <Welcome name="John" location="React World" />
      <Counter />
    </div>
  );
}

export default App;
```

**What you learned:**

- Class components extend `Component`
- State is stored in `this.state`
- `this.setState()` updates state
- `render()` returns the JSX

## Event Handling

Events in React work similarly to HTML but with camelCase naming.

**Button with Event Handler:**

```jsx
// src/components/ButtonDemo.jsx
import React, { Component } from "react";

class ButtonDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "Click the button!" };
  }

  handleClick = () => {
    this.setState({ message: "Button was clicked!" });
  };

  handleInputChange = (event) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <button onClick={this.handleClick}>Click Me</button>
        <br />
        <input
          type="text"
          onChange={this.handleInputChange}
          placeholder="Type something..."
        />
      </div>
    );
  }
}

export default ButtonDemo;
```

**Key Points:**

- Event handlers are methods on the class
- `onClick`, `onChange` use camelCase
- `event.target.value` gets input value
- Arrow functions automatically bind `this`

## Component Lifecycle

Components have lifecycle methods that run at different times.

**LifecycleDemo Component:**

```jsx
// src/components/LifecycleDemo.jsx
import React, { Component } from "react";

class LifecycleDemo extends Component {
  constructor(props) {
    super(props);
    console.log("1. Constructor: Component is being created");
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log("3. componentDidMount: Component has been added to DOM");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("4. componentDidUpdate: Component updated");
    console.log("Previous count:", prevState.count);
    console.log("Current count:", this.state.count);
  }

  componentWillUnmount() {
    console.log("5. componentWillUnmount: Component is being removed");
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log("2. Render: Component is rendering");
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
        <p>Open browser console to see lifecycle methods</p>
      </div>
    );
  }
}

export default LifecycleDemo;
```

**Lifecycle Order:**

1. `constructor()` - Initialize state
2. `render()` - Return JSX
3. `componentDidMount()` - Component added to DOM
4. `componentDidUpdate()` - After state/props change
5. `componentWillUnmount()` - Before component removed

## Modern React with Hooks

Now that you understand class components, let's learn hooks - the modern way to handle state and lifecycle in functional components.

### useState Hook

**Converting Counter to Functional Component:**

```jsx
// src/components/Counter.jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

**What changed:**

- No more `class` or `extends Component`
- `useState(0)` returns `[count, setCount]`
- `setCount(count + 1)` updates the state
- Much simpler and cleaner!

### useEffect Hook

**useEffect for Side Effects:**

```jsx
import React, { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This runs when component mounts or userId changes
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]); // Dependency array - only run when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**useEffect replaces:**

- `componentDidMount` - runs on mount
- `componentDidUpdate` - runs when dependencies change
- `componentWillUnmount` - return cleanup function

### Todo App with Hooks

**Complete Todo Component:**

```jsx
import React, { useState } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ]);
      setInputValue("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo..."
        onKeyPress={(e) => e.key === "Enter" && addTodo()}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

**Key Hook Concepts:**

- `useState` returns `[value, setter]`
- `useEffect` runs after render, can have dependencies
- Functional updates: `setCount(prev => prev + 1)`
- Hooks must be called at top level, not in loops/conditions

## React Router

### Setup & Basic Routing

```jsx
// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/old-path" element={<Navigate to="/new-path" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Protected Routes with useEffect

```jsx
// components/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Usage in App.jsx
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
```

## React Authentication (localStorage)

### Auth Context & Provider

```jsx
// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app start
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Login/Register Components

```jsx
// components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
```

## Conditional Rendering

### Ternary Operator & Logical AND

```jsx
function UserDashboard() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  if (!user) {
    return <div>Please log in to view dashboard</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>

      {/* Ternary operator */}
      <div
        className={user.role === "admin" ? "admin-dashboard" : "user-dashboard"}
      >
        {user.role === "admin" ? "Admin Panel" : "User Dashboard"}
      </div>

      {/* Logical AND for conditional rendering */}
      {user.role === "admin" && <button>Create New User</button>}

      {/* Conditional rendering with null */}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <div>
          <h2>Your Posts</h2>
          {posts.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>
          No posts found. <button>Create your first post</button>
        </p>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Unit Testing

### React Testing

**Login.test.jsx:**

```jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../contexts/AuthContext";

// Mock fetch
global.fetch = jest.fn();

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders login form", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
```

## API Integration

### React API Calls

```jsx
// services/api.js
const API_BASE = "/api";

export const api = {
  auth: {
    login: (credentials) =>
      fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }).then((res) => res.json()),

    register: (userData) =>
      fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }).then((res) => res.json()),
  },

  students: {
    getAll: () => fetch(`${API_BASE}/students`).then((res) => res.json()),

    create: (studentData) =>
      fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentData),
      }).then((res) => res.json()),

    delete: (id) =>
      fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
  },
};
```

## Project Structure

### React Project Structure

```
react-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Common Issues & Solutions

### React Issues

1. **State not updating**: Use functional updates `setState(prev => prev + 1)`
2. **Infinite re-renders**: Add dependencies to useEffect or memoize callbacks
3. **Props not updating**: Use key prop to force re-mount
4. **Memory leaks**: Clean up subscriptions in useEffect return function

## Next Steps

- **State Management**: Redux, Zustand, Context API
- **Forms**: React Hook Form, Formik
- **UI Libraries**: Material-UI, Ant Design, Chakra UI
- **Testing**: React Testing Library, Jest, Cypress
- **Performance**: Code splitting, lazy loading, memoization
- **PWA**: Service workers, offline support

Happy coding! 🚀

## Creating a React App

### Option 1: Using Vite (Recommended - Fast and Modern)

Vite is a build tool that provides a fast development experience for React apps.

1. Open your terminal and run:

   ```bash
   npm create vite@latest my-first-react-app -- --template react
   ```

2. Navigate to the project:

   ```bash
   cd my-first-react-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Your React app will be running at `http://localhost:5173`

### Option 2: Using Create React App (Classic)

If you prefer the traditional approach:

1. Create the app:

   ```bash
   npx create-react-app my-first-react-app
   ```

2. Navigate and start:
   ```bash
   cd my-first-react-app
   npm start
   ```

Your app will run at `http://localhost:3000`

## Understanding the Project Structure

After creating your app, you'll see these key files:

```
my-first-react-app/
├── public/
│   ├── index.html          # Main HTML file
│   └── favicon.ico         # App icon
├── src/
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point (renders App)
│   ├── index.css           # Global styles
│   └── assets/             # Static assets
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration (if using Vite)
```

## React Basics

### Components

React apps are built with components. Here's a simple component:

```jsx
// src/Greeting.jsx
function Greeting() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to your first React component.</p>
    </div>
  );
}

export default Greeting;
```

### JSX

JSX is a syntax extension for JavaScript that looks like HTML:

```jsx
const element = <h1>Hello, world!</h1>;
```

### Props

Props allow you to pass data to components:

```jsx
// Parent component
function App() {
  return <Greeting name="Alice" />;
}

// Child component
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### State

State allows components to manage their own data:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Hooks

Hooks are functions that let you use state and lifecycle features in functional components:

- `useState`: Manage component state
- `useEffect`: Handle side effects (API calls, subscriptions)
- `useContext`: Access context values

## Building Your First App

Let's create a simple todo app:

1. Create a new component `src/TodoApp.jsx`:

```jsx
import { useState } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

2. Update `src/App.jsx` to use your new component:

```jsx
import TodoApp from "./TodoApp";

function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
```

## Next Steps

1. **Learn More**: Check the official React documentation at [react.dev](https://react.dev)
2. **Styling**: Explore CSS modules, styled-components, or Tailwind CSS
3. **Routing**: Add navigation with React Router
4. **State Management**: Learn Redux or Context API for complex apps
5. **Testing**: Write tests with Jest and React Testing Library
6. **Deployment**: Deploy to Netlify, Vercel, or GitHub Pages

## Dockerizing Your React App

Docker allows you to containerize your React app for consistent development and deployment.

### Dockerfile (Development)

Create a `Dockerfile` in your project root:

```dockerfile
# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 7001 (as specified for your school server)
EXPOSE 7001

# Set environment variable for production
ENV PORT=7001

# Start development server
CMD ["npm", "start"]
```

### Dockerfile (Production - Serve with Node.js)

For production on your school server, serve the built app with a simple Node.js server:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage - serve with Node.js
FROM node:18-alpine

WORKDIR /app

# Install serve globally for production
RUN npm install -g serve

# Copy built app
COPY --from=build /app/dist ./dist

# Expose port 7001
EXPOSE 7001

# Serve the app
CMD ["serve", "-s", "dist", "-l", "7001"]
```

### docker-compose.yml (Development)

Create `docker-compose.yml` for easy development setup:

```yaml
version: "3.8"

services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "7001:7001" # Map to port 7001 for your school server
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=7001
    networks:
      - react-network

networks:
  react-network:
    driver: bridge
```

### docker-compose.yml (Production)

For production deployment on your school server:

```yaml
version: "3.8"

services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "7001:7001" # Your specified port
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - react-network

networks:
  react-network:
    driver: bridge
```

### .dockerignore

Create `.dockerignore` to exclude unnecessary files:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
```

### Building and Running

**Development:**

```bash
# Build and run with docker-compose
docker-compose up --build

# Or build and run manually
docker build -t react-app .
docker run -p 7001:7001 -v $(pwd):/app react-app
```

**Production:**

```bash
# Build production image
docker build -f Dockerfile.prod -t react-app-prod .

# Run production container
docker run -d -p 7001:7001 --name react-app-prod react-app-prod
```

### Connecting to Backend API

When running on your school server, update your API calls to use the backend service:

```javascript
// For development (when backend is on port 7000)
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "http://192.41.1.117:7000/api" // Production - use your school server IP
    : "http://localhost:7000/api"; // Development
```

For docker-compose with backend:

```yaml
version: "3.8"

services:
  react-app:
    build: .
    ports:
      - "7001:7001" # Frontend on 7001
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://192.41.1.117:7000/api
    networks:
      - app-network

  backend:
    # Your backend service config
    ports:
      - "7000:7000" # Backend on 7000
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Environment Variables

Create `.env` file for environment-specific configs:

```env
# For school server deployment
REACT_APP_API_URL=http://192.41.1.117:7000/api
REACT_APP_ENV=production

# For local development
# REACT_APP_API_URL=http://localhost:7000/api
# REACT_APP_ENV=development
```

Access in your React app:

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

### Common Docker Issues

1. **Port conflicts**: Change host port if 7001 is in use
2. **Hot reload not working**: Ensure volumes are mounted correctly
3. **Node modules issues**: Use `docker-compose down -v` to clear volumes
4. **Build cache**: Use `docker build --no-cache` for clean builds

## Final Deployment to School Server

Since you're deploying directly without nginx, here's your complete setup:

### 1. Build and Deploy

```bash
# Build the production image
docker build -f Dockerfile.prod -t react-app-prod .

# Run on your school server
docker run -d -p 7001:7001 --name react-app-prod react-app-prod

# Check if it's running
docker ps
```

### 2. Environment Setup

Ensure your `.env` file has:

```env
REACT_APP_API_URL=http://192.41.1.117:7000/api
REACT_APP_ENV=production
```

### 3. Access Your App

- Frontend: `http://192.41.1.117:7001`
- Backend: `http://192.41.1.117:7000`

### 4. Troubleshooting

- Check container logs: `docker logs react-app-prod`
- Stop and restart: `docker stop react-app-prod && docker start react-app-prod`
- Remove and redeploy: `docker rm react-app-prod && docker run -d -p 7001:7001 --name react-app-prod react-app-prod`

Your React app is now ready for production deployment on your school server! 🎉
