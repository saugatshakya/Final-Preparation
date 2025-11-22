# React Practical Notes

## 1. Localstorage for Authentication

### Example:

```jsx
// Save token after login
localStorage.setItem("token", userToken);
// Retrieve token for protection
const token = localStorage.getItem("token");
```

## 2. Login/Register/Logout

### Example:

```jsx
// Login.jsx
function handleLogin() {
  // Validate user, get token
  localStorage.setItem("token", token);
}

function handleLogout() {
  localStorage.removeItem("token");
}
```

## 3. Add a Route and Protect It

### Example:

```jsx
// App.jsx
<Route path="/dashboard" element={<Dashboard />} />;

// Protect route with useEffect
import { useNavigate } from "react-router-dom";
useEffect(() => {
  if (!localStorage.getItem("token")) navigate("/login");
}, []);
```

## 4. Conditional Rendering

### Example:

```jsx
{
  token ? <Dashboard /> : <Login />;
}
```

## 5. Sample Exam Tasks

- Implement login/logout with localstorage
- Add and protect a route
- Use conditional rendering for authentication

## 6. Common Pitfalls

- Infinite loops in useEffect
- Not cleaning up subscriptions
- Incorrect dependency arrays

## 7. Debugging Tips

- Use React DevTools
- Check console for warnings/errors
- Use console.log in components

## 8. Sample Exam Tasks

- Implement login/logout with localstorage
- Add and protect a route with useEffect
- Create a component with form and state
- Use conditional rendering for auth

## 9. Full Example: Login System

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token and set user
      setUser({ name: "John Doe" });
    }
  }, []);

  const login = (credentials) => {
    // API call to login
    localStorage.setItem("token", "fake-token");
    setUser({ name: "John Doe" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

// ProtectedRoute.jsx
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

## 10. Troubleshooting Guide

### Common Issues:

- **Component not re-rendering:** Check state updates and key props
- **useEffect running infinitely:** Fix dependency array
- **Context not updating:** Ensure proper provider setup
- **Routing not working:** Check route configuration

### Debugging Steps:

1. Use React DevTools to inspect component tree
2. Check console for warnings/errors
3. Verify hook dependencies
4. Test components in isolation

## 11. Integration Examples

### Complete Todo App with Auth

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with API
      fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// TodoContext.jsx
const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const todos = await response.json();
    setTodos(todos);
  };

  const addTodo = async (text) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ text })
    });
    if (response.ok) {
      fetchTodos();
    }
  };

  const toggleTodo = async (id) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.ok) {
      fetchTodos();
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}

// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { TodoProvider } from './TodoContext';

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/todos" element={<ProtectedRoute><TodoApp /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/todos" />} />
          </Routes>
        </BrowserRouter>
      </TodoProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    if
```
