# React Theory Notes

## 1. Introduction
React is a JavaScript library for building user interfaces, especially SPA (Single Page Applications).

## 2. Components
Components are reusable pieces of UI. They can be functional or class-based.

### Example (Functional):
```jsx
function Greeting(props) {
	return <h1>Hello, {props.name}!</h1>;
}
```

## 3. Hooks
Hooks let you use state and other React features in functional components.

### useState
```jsx
const [count, setCount] = useState(0);
```

### useEffect
```jsx
useEffect(() => {
	// Runs after render
}, []);
```

## 4. Routing
React Router enables navigation between views/components.

### Example:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}
```

## 5. Authentication & Localstorage
Store tokens in localstorage for authentication.

### Example:
```jsx
// Save token
localStorage.setItem('token', userToken);
// Retrieve token
const token = localStorage.getItem('token');
```

## 6. Protecting Routes
Use useEffect to redirect unauthenticated users.

### Example:
```jsx
import { useNavigate } from 'react-router-dom';
useEffect(() => {
	if (!localStorage.getItem('token')) navigate('/login');
}, []);
```

## 7. Context API
For global state management, use Context API.

### Example:
```jsx
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Component />
    </UserContext.Provider>
  );
}

function Component() {
  const { user } = useContext(UserContext);
  return <div>{user ? user.name : 'Not logged in'}</div>;
}
```

## 8. Custom Hooks
Create reusable logic with custom hooks.

### Example:
```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
```

## 9. Useful Exam Patterns
- Create component: function or class
- Use hooks for state/effects
- Add routes in App.jsx
- Protect routes with useEffect
- Use localstorage for authentication

## 10. Sample Exam Q&A
**Q: How do you create a new component in React?**
A: Define a function or class that returns JSX.

**Q: How do you protect a route?**
A: Use useEffect to check authentication and redirect if needed.

**Q: How do you store/retrieve tokens?**
A: Use localStorage methods.

**Q: What is the difference between useState and useEffect?**
A: useState manages state, useEffect handles side effects.

**Q: How do you manage global state?**
A: Use Context API or state management libraries like Redux.

## 10. Debugging Tips
- Use React DevTools browser extension
- Check component re-rendering causes
- Review hook dependency arrays
- Use console.log in useEffect for debugging

## 11. Sample Exam Tasks
- Explain React component lifecycle
- Describe hooks and their purposes
- Discuss state management in React
- Explain routing with react-router

## 12. Key Takeaways
- React is a component-based library for building UIs
- Components can be functional or class-based
- Hooks enable state and lifecycle in functional components
- React Router handles client-side routing
- Context API manages global state

## 13. Advanced Concepts
### Custom Hooks
```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

### Higher-Order Components (HOC)
```jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        // Validate token and set user
        setUser({ name: 'John' });
      }
    }, []);

    if (!user) {
      return <Login />;
    }

    return <Component {...props} user={user} />;
  };
}
```

### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 14. Common Exam Scenarios
- Build components with state management
- Implement routing with protection
- Create forms with validation
- Manage global state with Context
- Handle side effects with useEffect

---
Refer to your slides (React-2025.pptx.pdf, Authentication.pptx.pdf) for diagrams and more examples.
