# Angular Practical Notes

## 1. Localstorage for Authentication

### Example:

```typescript
// Save token after login
localStorage.setItem("token", userToken);
// Retrieve token for guard
const token = localStorage.getItem("token");
```

## 2. Login/Register/Logout

### Example:

```typescript
// login.component.ts
login() {
  // Validate user, get token
  localStorage.setItem('token', token);
}

logout() {
  localStorage.removeItem('token');
}
```

## 3. Add a Route and Protect It

### Example:

```typescript
// app.routes.ts
{ path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }

// auth.guard.ts
canActivate(): boolean {
  return !!localStorage.getItem('token');
}
```

## 4. Component Creation

### CLI Command:

```bash
ng g c Chat
```

## 5. Unit Testing

### Example:

```typescript
describe("LoginComponent", () => {
  it("should create", () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
```

## 6. Common Pitfalls

- Forgetting to import modules
- Not subscribing to observables
- Incorrect guard implementation

## 7. Debugging Tips

- Use Angular DevTools
- Check console for errors
- Use breakpoints in browser dev tools

## 8. Sample Exam Tasks

- Implement login/logout with localstorage
- Add and protect a route with guard
- Create a new component with form
- Write a unit test for a service

## 9. Full Example: Login System

````typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private validateToken(token: string) {
    this.http.post(`${this.apiUrl}/validate`, { token }).subscribe(
      (user) => this.currentUserSubject.next(user),
      () => this.logout()
    );
  }
}

// auth.guard.ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}

// login.component.ts
@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email" type="email">
      <input formControlName="password" placeholder="Password" type="password">
      <button type="submit" [disabled]="!loginForm.valid">Login</button>
    </form>
    <div *ngIf="error">{{ error }}</div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.error = 'Login failed'
      });
    }
  }
}

## 10. Troubleshooting Guide
### Common Issues:
- **Component not rendering:** Check selector and template syntax
- **Route not working:** Verify route configuration and imports
- **Guard not protecting:** Check guard implementation and route setup
- **Service injection failed:** Ensure service is provided correctly

### Debugging Steps:
1. Check browser console for Angular errors
2. Use Angular DevTools extension
3. Verify component lifecycle hooks
4. Test guards independently

## 11. Integration Examples
### Complete Auth System
```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private validateToken(token: string) {
    this.http.post(`${this.apiUrl}/validate`, { token }).subscribe(
      (user) => this.currentUserSubject.next(user),
      () => this.logout()
    );
  }
}

// auth.guard.ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}

// login.component.ts
@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email" type="email">
      <input formControlName="password" placeholder="Password" type="password">
      <button type="submit" [disabled]="!loginForm.valid">Login</button>
    </form>
    <div *ngIf="error">{{ error }}</div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.error = 'Login failed'
      });
    }
  }
}

## 12. Best Practices
- Use reactive forms for complex validation
- Implement lazy loading for large applications
- Use interceptors for common HTTP logic
- Implement proper error handling
- Use OnPush change detection for performance
- Follow Angular style guide
````
