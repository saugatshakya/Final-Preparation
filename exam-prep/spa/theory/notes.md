# SPA (Single Page Application) Theory Notes

## 1. Introduction
SPA is a web application that loads a single HTML page and dynamically updates content as the user interacts with the app.

## 2. Architecture
- Only one HTML page is loaded
- Navigation and state changes are handled client-side

## 3. Routing
Client-side routing enables navigation without full page reloads.

### Angular Example:
```typescript
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
];
```

### React Example:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<BrowserRouter>
	<Routes>
		<Route path="/home" element={<Home />} />
		<Route path="/chat" element={<Chat />} />
	</Routes>
</BrowserRouter>
```

## 4. State Management
State can be managed using hooks (React) or services (Angular). Localstorage is often used for persistence.

### Example:
```jsx
const [user, setUser] = useState(null);
```

## 5. Conditional Rendering
Show/hide UI elements based on state.

### Angular Example:
```html
<div *ngIf="isLoggedIn">Welcome!</div>
```

### React Example:
```jsx
{isLoggedIn ? <div>Welcome!</div> : <Login />}
```

## 6. State Management Libraries
For complex SPAs, use libraries like Redux (React) or NgRx (Angular).

### Redux Example (React):
```jsx
// Action
const loginAction = { type: 'LOGIN', payload: user };

// Reducer
function userReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    default:
      return state;
  }
}

// Store
const store = createStore(userReducer);
```

## 7. Performance Optimization
- Code splitting
- Lazy loading
- Memoization

### React Lazy Loading:
```jsx
const LazyComponent = lazy(() => import('./LazyComponent'));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 8. Useful Exam Patterns
- Set up routing for navigation
- Use guards/hooks for protection
- Use localstorage for persistence
- Implement conditional rendering

## 9. Sample Exam Q&A
**Q: What is an SPA?**
A: A web app that loads a single HTML page and updates content dynamically.

**Q: How do you implement routing?**
A: Use RouterModule (Angular) or react-router (React).

**Q: How do you conditionally render UI?**
A: Use *ngIf (Angular) or ternary/&& (React).

**Q: What is lazy loading?**
A: Loading components only when needed to improve performance.

**Q: How do you manage state in SPAs?**
A: Use hooks/services, localstorage, or state management libraries.

## 10. Debugging Tips
- Check browser URL for routing issues
- Monitor state changes in dev tools
- Review conditional rendering logic
- Test navigation without full page reloads

## 11. Sample Exam Tasks
- Explain SPA architecture vs traditional web apps
- Describe client-side routing
- Discuss state management approaches
- Explain conditional rendering techniques
