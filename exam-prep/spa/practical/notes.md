# SPA Practical Notes

## 1. Angular SPA
- Add route in `app.routes.ts`:
	```typescript
	{ path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
	```
- Use *ngIf for conditional rendering:
	```html
	<div *ngIf="isLoggedIn">Welcome!</div>
	```
- Protect route with canActivate:
	```typescript
	canActivate(): boolean {
		return !!localStorage.getItem('token');
	}
	```

## 2. React SPA
- Add route in `App.jsx`:
	```jsx
	<Route path="/chat" element={<Chat />} />
	```
- Use useState/useEffect for state and protection:
	```jsx
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		setIsLoggedIn(!!localStorage.getItem('token'));
	}, []);
	```
- Conditional rendering with ternary/&&:
	```jsx
	{isLoggedIn ? <Chat /> : <Login />}
	```

## 3. Common Pitfalls
- Not handling route parameters correctly
- Forgetting to protect routes
- State not persisting on refresh

## 4. Debugging Tips
- Check browser URL for routing issues
- Use dev tools network tab
- Log state changes

## 5. Sample Exam Tasks
- Add and protect a route
- Use conditional rendering for authentication
- Implement navigation between pages
- Handle route parameters

## 6. Full Example: Protected Dashboard
### Angular:
```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="user; else login">
      <h1>Welcome {{ user.name }}</h1>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #login>
      <p>Please log in</p>
    </ng-template>
  `
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
```

### React:
```jsx
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---
Refer to your codebase and slides for more examples.
