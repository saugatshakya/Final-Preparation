# Angular Frontend Development Crash Course

This comprehensive guide covers Angular frontend development with components, services, routing, forms, state management, and API integration.

## Prerequisites

- Node.js (version 16 or higher) installed
- npm (comes with Node.js) or yarn
- Angular CLI installed globally: `npm install -g @angular/cli`
- A code editor (VS Code recommended)
- Basic TypeScript/JavaScript knowledge

## Quick Start

```bash
# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli

# Create new Angular project
ng new my-angular-app
cd my-angular-app

# Install additional dependencies
npm install @angular/router @angular/forms @angular/common/http bootstrap

# Start development server
ng serve
```

Your app will be available at `http://localhost:4200`

## Project Structure

After creating your Angular app, you'll see this structure:

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## Creating Your First Component

Angular CLI generates a default app component. Let's understand its structure:

**src/app/app.component.ts:**

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "my-angular-app";
}
```

**src/app/app.component.html:**

```html
<div class="container mt-4">
  <h1>{{title}}</h1>
  <p>Welcome to Angular!</p>
</div>
```

**What just happened:**

- `@Component` decorator defines the component metadata
- `selector` - how to use this component in templates
- `templateUrl` - HTML template file
- `styleUrls` - CSS styles for this component
- `title` property is bound to the template using `{{ }}`

## Data Binding

Angular provides several types of data binding:

### 1. Interpolation (One-way binding)

```html
<!-- app.component.html -->
<h1>{{title}}</h1>
<p>{{getMessage()}}</p>
```

```typescript
// app.component.ts
export class AppComponent {
  title = "My Angular App";

  getMessage(): string {
    return "Hello from method!";
  }
}
```

### 2. Property Binding

```html
<!-- Bind properties -->
<img [src]="imageUrl" [alt]="imageAlt" />
<button [disabled]="isDisabled">Click me</button>
```

```typescript
export class AppComponent {
  imageUrl = "https://angular.io/assets/images/logos/angular/angular.svg";
  imageAlt = "Angular Logo";
  isDisabled = false;
}
```

### 3. Event Binding

```html
<button (click)="onButtonClick()">Click me</button>
<input (input)="onInputChange($event)" [value]="inputValue" />
```

```typescript
export class AppComponent {
  inputValue = "";

  onButtonClick(): void {
    console.log("Button clicked!");
  }

  onInputChange(event: any): void {
    this.inputValue = event.target.value;
  }
}
```

### 4. Two-way Binding

```html
<input [(ngModel)]="username" placeholder="Enter username" />
<p>Hello {{username}}!</p>
```

```typescript
export class AppComponent {
  username = "";
}
```

## Directives

Directives are instructions in the DOM. Angular has built-in and custom directives.

### Built-in Structural Directives

**ngIf - Conditional rendering:**

```html
<div *ngIf="isLoggedIn">
  <p>Welcome back!</p>
</div>
<div *ngIf="!isLoggedIn">
  <p>Please log in</p>
</div>
```

**ngFor - Looping:**

```html
<ul>
  <li *ngFor="let item of items; let i = index">
    {{i + 1}}. {{item.name}} - ${{item.price}}
  </li>
</ul>
```

```typescript
export class AppComponent {
  items = [
    { name: "Apple", price: 1.5 },
    { name: "Banana", price: 0.75 },
    { name: "Orange", price: 2.0 },
  ];
}
```

**ngSwitch - Multiple conditions:**

```html
<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Admin Dashboard</p>
  <p *ngSwitchCase="'user'">User Profile</p>
  <p *ngSwitchDefault>Guest View</p>
</div>
```

### Built-in Attribute Directives

**ngClass - Dynamic CSS classes:**

```html
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">
  Dynamic classes
</div>
```

**ngStyle - Dynamic styles:**

```html
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">
  Dynamic styles
</div>
```

## Creating Custom Components

Let's create a custom component using Angular CLI:

```bash
ng generate component user-profile
# or shorthand
ng g c user-profile
```

This creates:

- `user-profile.component.ts`
- `user-profile.component.html`
- `user-profile.component.css`
- `user-profile.component.spec.ts`

**src/app/user-profile/user-profile.component.ts:**

```typescript
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent {
  @Input() user: any;
  @Output() userSelected = new EventEmitter<any>();

  onSelectUser(): void {
    this.userSelected.emit(this.user);
  }
}
```

**src/app/user-profile/user-profile.component.html:**

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">{{user?.name}}</h5>
    <p class="card-text">{{user?.email}}</p>
    <button class="btn btn-primary" (click)="onSelectUser()">
      Select User
    </button>
  </div>
</div>
```

**Using the component:**

```html
<!-- app.component.html -->
<app-user-profile [user]="selectedUser" (userSelected)="onUserSelected($event)">
</app-user-profile>
```

## Services and Dependency Injection

Services handle business logic and data management. Create a service:

```bash
ng generate service user
# or
ng g s user
```

**src/app/user.service.ts:**

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: "root", // Makes it available app-wide
})
export class UserService {
  private apiUrl = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Using the service in a component:**

```typescript
import { Component, OnInit } from "@angular/core";
import { UserService, User } from "./user.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading users:", error);
        this.loading = false;
      },
    });
  }
}
```

## Routing and Navigation

Angular Router enables navigation between different views.

**1. Set up routing in app.module.ts:**

```typescript
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "users", component: UserListComponent },
  { path: "users/:id", component: UserDetailComponent },
  { path: "**", redirectTo: "/home" }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

**2. Add router outlet to app component:**

```html
<!-- app.component.html -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container">
    <a class="navbar-brand" routerLink="/home">Angular App</a>
    <div class="navbar-nav">
      <a class="nav-link" routerLink="/home" routerLinkActive="active">Home</a>
      <a class="nav-link" routerLink="/users" routerLinkActive="active"
        >Users</a
      >
    </div>
  </div>
</nav>

<div class="container mt-4">
  <router-outlet></router-outlet>
</div>
```

**3. Navigate programmatically:**

```typescript
import { Router } from "@angular/router";

export class UserListComponent {
  constructor(private router: Router) {}

  goToUserDetail(userId: number): void {
    this.router.navigate(["/users", userId]);
  }
}
```

## Forms

Angular provides two approaches to forms: Template-driven and Reactive forms.

### Template-driven Forms

**1. Import FormsModule:**

```typescript
// app.module.ts
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [FormsModule],
})
export class AppModule {}
```

**2. Create template-driven form:**

```html
<!-- login.component.html -->
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <div class="form-group">
    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      class="form-control"
      [(ngModel)]="loginData.email"
      required
      email
      #email="ngModel"
    />
    <div *ngIf="email.invalid && email.touched" class="text-danger">
      Please enter a valid email
    </div>
  </div>

  <div class="form-group">
    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      class="form-control"
      [(ngModel)]="loginData.password"
      required
      minlength="6"
      #password="ngModel"
    />
    <div *ngIf="password.invalid && password.touched" class="text-danger">
      Password must be at least 6 characters
    </div>
  </div>

  <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid">
    Login
  </button>
</form>
```

```typescript
// login.component.ts
export class LoginComponent {
  loginData = {
    email: "",
    password: "",
  };

  onSubmit(form: any): void {
    if (form.valid) {
      console.log("Login data:", this.loginData);
      // Call authentication service
    }
  }
}
```

### Reactive Forms

**1. Import ReactiveFormsModule:**

```typescript
// app.module.ts
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [ReactiveFormsModule],
})
export class AppModule {}
```

**2. Create reactive form:**

```typescript
// registration.component.ts
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup): any {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log("Registration data:", this.registrationForm.value);
      // Call registration service
    }
  }

  get firstName() {
    return this.registrationForm.get("firstName");
  }
  get lastName() {
    return this.registrationForm.get("lastName");
  }
  get email() {
    return this.registrationForm.get("email");
  }
  get password() {
    return this.registrationForm.get("password");
  }
  get confirmPassword() {
    return this.registrationForm.get("confirmPassword");
  }
}
```

```html
<!-- registration.component.html -->
<form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label>First Name:</label>
    <input type="text" class="form-control" formControlName="firstName" />
    <div *ngIf="firstName?.invalid && firstName?.touched" class="text-danger">
      First name is required and must be at least 2 characters
    </div>
  </div>

  <div class="form-group">
    <label>Last Name:</label>
    <input type="text" class="form-control" formControlName="lastName" />
    <div *ngIf="lastName?.invalid && lastName?.touched" class="text-danger">
      Last name is required and must be at least 2 characters
    </div>
  </div>

  <div class="form-group">
    <label>Email:</label>
    <input type="email" class="form-control" formControlName="email" />
    <div *ngIf="email?.invalid && email?.touched" class="text-danger">
      Please enter a valid email
    </div>
  </div>

  <div class="form-group">
    <label>Password:</label>
    <input type="password" class="form-control" formControlName="password" />
    <div *ngIf="password?.invalid && password?.touched" class="text-danger">
      Password must be at least 6 characters
    </div>
  </div>

  <div class="form-group">
    <label>Confirm Password:</label>
    <input
      type="password"
      class="form-control"
      formControlName="confirmPassword"
    />
    <div
      *ngIf="confirmPassword?.errors?.['mismatch'] && confirmPassword?.touched"
      class="text-danger"
    >
      Passwords do not match
    </div>
  </div>

  <button
    type="submit"
    class="btn btn-primary"
    [disabled]="registrationForm.invalid"
  >
    Register
  </button>
</form>
```

## State Management with Services

For complex applications, use a state management solution. Angular doesn't have a built-in state management like Redux, but you can use services or NgRx.

**Simple state management with BehaviorSubject:**

```typescript
// src/app/state/auth.state.ts
import { BehaviorSubject } from "rxjs";

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: "",
};

export class AuthStateService {
  private state$ = new BehaviorSubject<AuthState>(initialState);

  getState() {
    return this.state$.asObservable();
  }

  setAuthenticated(isAuthenticated: boolean, user?: any, token?: string): void {
    const currentState = this.state$.value;
    this.state$.next({
      ...currentState,
      isAuthenticated,
      user: user || currentState.user,
      token: token || currentState.token,
    });
  }

  logout(): void {
    this.state$.next(initialState);
  }
}
```

**Using the state service:**

```typescript
// auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthStateService } from "./state/auth.state";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private authState: AuthStateService) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post("/api/auth/login", credentials).subscribe({
      next: (response: any) => {
        this.authState.setAuthenticated(true, response.user, response.token);
      },
      error: (error) => {
        console.error("Login failed:", error);
      },
    });
  }

  logout(): void {
    this.authState.logout();
  }
}
```

## HTTP Interceptors

Create interceptors for common HTTP tasks like adding auth tokens or handling errors.

```typescript
// src/app/interceptors/auth.interceptor.ts
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthStateService } from "../state/auth.state";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authState: AuthStateService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authState.getState().value.token;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}

// src/app/interceptors/error.interceptor.ts
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Handle unauthorized access
          console.log("Unauthorized access - redirect to login");
        }
        return throwError(error);
      })
    );
  }
}
```

**Register interceptors in app.module.ts:**

```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AppModule {}
```

## Guards (Route Protection)

Protect routes using Angular guards.

```bash
ng generate guard auth
```

**src/app/guards/auth.guard.ts:**

```typescript
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthStateService } from "../state/auth.state";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authState: AuthStateService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authState.getState().value.isAuthenticated;

    if (!isAuthenticated) {
      this.router.navigate(["/login"]);
      return false;
    }

    return true;
  }
}
```

**Use the guard in routing:**

```typescript
const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
];
```

## Testing

Angular CLI generates spec files for testing. Run tests with:

```bash
ng test  # Run unit tests
ng test --watch=false --browsers=ChromeHeadless  # CI mode
```

**Example component test:**

```typescript
// user-profile.component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserProfileComponent } from "./user-profile.component";

describe("UserProfileComponent", () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit userSelected event when onSelectUser is called", () => {
    spyOn(component.userSelected, "emit");
    component.user = { id: 1, name: "John Doe" };
    component.onSelectUser();
    expect(component.userSelected.emit).toHaveBeenCalledWith(component.user);
  });
});
```

**Example service test:**

```typescript
// user.service.spec.ts
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should retrieve users", () => {
    const mockUsers = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(
      "https://jsonplaceholder.typicode.com/users"
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockUsers);
  });
});
```

## WebSocket Integration for Real-Time Features

Angular provides excellent support for WebSocket connections using RxJS. Let's implement real-time features like chat, notifications, and live data updates.

### WebSocket Service with RxJS

Create a WebSocket service for managing connections:

```bash
ng generate service websocket
```

**src/app/services/websocket.service.ts:**

```typescript
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { retry, catchError, tap, delayWhen } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  room?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$?: WebSocketSubject<WebSocketMessage>;
  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private messages$ = new Subject<WebSocketMessage>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  // Public observables
  public connectionStatus = this.connectionStatus$.asObservable();
  public messages = this.messages$.asObservable();

  constructor() {}

  connect(token?: string): void {
    if (this.socket$) {
      this.disconnect();
    }

    const wsUrl = environment.production
      ? `ws://192.41.1.117:3000?token=${token || ''}`
      : `ws://localhost:3000?token=${token || ''}`;

    this.socket$ = webSocket<WebSocketMessage>({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.connectionStatus$.next(true);
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.connectionStatus$.next(false);
          this.attemptReconnect(token);
        }
      }
    });

    // Handle incoming messages
    this.socket$.pipe(
      retry({
        count: this.maxReconnectAttempts,
        delay: (error, retryCount) => {
          console.log(`WebSocket retry attempt ${retryCount}`);
          return timer(this.reconnectDelay * Math.pow(2, retryCount - 1)); // Exponential backoff
        }
      }),
      catchError(error => {
        console.error('WebSocket error:', error);
        this.connectionStatus$.next(false);
        throw error;
      })
    ).subscribe({
      next: (message) => this.messages$.next(message),
      error: (error) => console.error('WebSocket subscription error:', error)
    });
  }

  private attemptReconnect(token?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect(token);
      }, this.reconnectDelay);

      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.socket$ && this.connectionStatus$.value) {
      this.socket$.next(message);
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = undefined;
    }
    this.connectionStatus$.next(false);
  }

  // Specific message types
  sendChatMessage(message: string, room?: string): void {
    this.sendMessage({
      type: 'chat',
      payload: { message, room },
      timestamp: Date.now()
    });
  }

  joinRoom(room: string): void {
    this.sendMessage({
      type: 'join_room',
      payload: { room },
      timestamp: Date.now()
    });
  }

  leaveRoom(room: string): void {
    this.sendMessage({
      type: 'leave_room',
      payload: { room },
      timestamp: Date.now()
    });
  }

  sendTypingIndicator(room?: string): void {
    this.sendMessage({
      type: 'typing',
      payload: { room },
      timestamp: Date.now()
    });
  }

  stopTypingIndicator(room?: string): void {
    this.sendMessage({
      type: 'stop_typing',
      payload: { room },
      timestamp: Date.now()
    });
  }
}
```

### Real-Time Chat Component

Create a chat component for real-time messaging:

```bash
ng generate component chat
```

**src/app/components/chat/chat.component.ts:**

```typescript
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketService, ChatMessage, WebSocketMessage } from '../../services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() room?: string;
  @Input() username = 'Anonymous';

  messages: ChatMessage[] = [];
  chatForm: FormGroup;
  isConnected = false;
  typingUsers: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private wsService: WebSocketService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to connection status
    this.wsService.connectionStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.isConnected = connected;
        if (connected && this.room) {
          this.wsService.joinRoom(this.room);
        }
      });

    // Subscribe to messages
    this.wsService.messages
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.handleMessage(message);
      });
  }

  ngOnDestroy(): void {
    if (this.room) {
      this.wsService.leaveRoom(this.room);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'chat':
        this.handleChatMessage(message.payload);
        break;
      case 'user_joined':
        this.addSystemMessage(`${message.payload.username} joined the room`);
        break;
      case 'user_left':
        this.addSystemMessage(`${message.payload.username} left the room`);
        break;
      case 'typing':
        this.handleTypingIndicator(message.payload, true);
        break;
      case 'stop_typing':
        this.handleTypingIndicator(message.payload, false);
        break;
    }
  }

  private handleChatMessage(payload: any): void {
    const chatMessage: ChatMessage = {
      id: payload.id || Date.now().toString(),
      userId: payload.userId,
      username: payload.username,
      message: payload.message,
      timestamp: payload.timestamp || Date.now(),
      room: payload.room
    };
    this.messages.push(chatMessage);
    this.scrollToBottom();
  }

  private addSystemMessage(text: string): void {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      username: 'System',
      message: text,
      timestamp: Date.now(),
      room: this.room
    };
    this.messages.push(systemMessage);
    this.scrollToBottom();
  }

  private handleTypingIndicator(payload: any, isTyping: boolean): void {
    const username = payload.username;
    if (isTyping && !this.typingUsers.includes(username)) {
      this.typingUsers.push(username);
    } else if (!isTyping) {
      this.typingUsers = this.typingUsers.filter(user => user !== username);
    }
  }

  onSubmit(): void {
    if (this.chatForm.valid && this.isConnected) {
      const message = this.chatForm.value.message.trim();
      if (message) {
        this.wsService.sendChatMessage(message, this.room);
        this.chatForm.reset();
      }
    }
  }

  onTyping(): void {
    if (this.isConnected) {
      this.wsService.sendTypingIndicator(this.room);
    }
  }

  onStopTyping(): void {
    if (this.isConnected) {
      this.wsService.stopTypingIndicator(this.room);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  getTypingIndicatorText(): string {
    if (this.typingUsers.length === 0) return '';
    if (this.typingUsers.length === 1) {
      return `${this.typingUsers[0]} is typing...`;
    }
    if (this.typingUsers.length === 2) {
      return `${this.typingUsers[0]} and ${this.typingUsers[1]} are typing...`;
    }
    return `${this.typingUsers[0]} and ${this.typingUsers.length - 1} others are typing...`;
  }
}
```

**src/app/components/chat/chat.component.html:**

```html
<div class="chat-container">
  <div class="chat-header">
    <h3>Chat {{room ? '(' + room + ')' : ''}}</h3>
    <div class="connection-status" [class.connected]="isConnected">
      {{isConnected ? '🟢 Connected' : '🔴 Disconnected'}}
    </div>
  </div>

  <div class="chat-messages" #chatMessages>
    <div
      *ngFor="let message of messages"
      class="message"
      [class.own-message]="message.username === username"
      [class.system-message]="message.userId === 'system'"
    >
      <div class="message-header">
        <span class="username">{{message.username}}</span>
        <span class="timestamp">{{message.timestamp | date:'short'}}</span>
      </div>
      <div class="message-content">{{message.message}}</div>
    </div>
  </div>

  <div class="typing-indicator" *ngIf="typingUsers.length > 0">
    {{getTypingIndicatorText()}}
  </div>

  <form [formGroup]="chatForm" (ngSubmit)="onSubmit()" class="chat-input">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        formControlName="message"
        placeholder="Type a message..."
        (input)="onTyping()"
        (blur)="onStopTyping()"
        [disabled]="!isConnected"
        maxlength="500"
      />
      <button
        type="submit"
        class="btn btn-primary"
        [disabled]="!chatForm.valid || !isConnected"
      >
        Send
      </button>
    </div>
    <div class="character-count" *ngIf="chatForm.value.message">
      {{chatForm.value.message.length}}/500
    </div>
  </form>
</div>
```

**src/app/components/chat/chat.component.css:**

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.connection-status {
  font-size: 0.8em;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #dc3545;
  color: white;
}

.connection-status.connected {
  background-color: #28a745;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e9ecef;
}

.message.own-message {
  background-color: #007bff;
  color: white;
  margin-left: 50px;
}

.message.system-message {
  background-color: #f8f9fa;
  font-style: italic;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.8em;
}

.username {
  font-weight: bold;
}

.timestamp {
  color: #6c757d;
}

.message.own-message .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.typing-indicator {
  padding: 5px 15px;
  font-style: italic;
  color: #6c757d;
  font-size: 0.9em;
}

.chat-input {
  padding: 10px 15px;
  background-color: white;
  border-top: 1px solid #ddd;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group .form-control {
  flex: 1;
}

.character-count {
  text-align: right;
  font-size: 0.8em;
  color: #6c757d;
  margin-top: 5px;
}
```

### Notification Service

Create a notification service for real-time alerts:

```bash
ng generate service notification
```

**src/app/services/notification.service.ts:**

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, WebSocketMessage } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationCount$ = new BehaviorSubject<number>(0);

  public notifications = this.notifications$.asObservable();
  public notificationCount = this.notificationCount$.asObservable();

  constructor() {}

  addNotification(notification: Notification): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notifications$.next(updatedNotifications);
    this.updateCount(updatedNotifications);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(updatedNotifications);
    this.updateCount(updatedNotifications);
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications$.next(updatedNotifications);
    this.updateCount(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notifications$.next(updatedNotifications);
    this.updateCount(updatedNotifications);
  }

  clearAll(): void {
    this.notifications$.next([]);
    this.notificationCount$.next(0);
  }

  private updateCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.notificationCount$.next(unreadCount);
  }

  // Handle WebSocket notification messages
  handleWebSocketMessage(message: WebSocketMessage): void {
    if (message.type === 'notification') {
      const notification: Notification = {
        id: message.payload.id || Date.now().toString(),
        type: message.payload.type || 'info',
        title: message.payload.title || 'Notification',
        message: message.payload.message || '',
        timestamp: message.payload.timestamp || Date.now(),
        read: false
      };
      this.addNotification(notification);
    }
  }
}
```

### Notification Component

**src/app/components/notification/notification.component.ts:**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.notificationService.notificationCount
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  clearAll(): void {
    this.notificationService.clearAll();
    this.showDropdown = false;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }
}
```

**src/app/components/notification/notification.component.html:**

```html
<div class="notification-container">
  <button
    class="notification-button"
    (click)="toggleDropdown()"
    [class.has-unread]="unreadCount > 0"
  >
    🔔
    <span class="badge" *ngIf="unreadCount > 0">{{unreadCount}}</span>
  </button>

  <div class="notification-dropdown" *ngIf="showDropdown" (clickOutside)="showDropdown = false">
    <div class="dropdown-header">
      <h4>Notifications</h4>
      <div class="dropdown-actions">
        <button
          class="btn btn-sm btn-outline-primary"
          (click)="markAllAsRead()"
          [disabled]="unreadCount === 0"
        >
          Mark all read
        </button>
        <button class="btn btn-sm btn-outline-danger" (click)="clearAll()">
          Clear all
        </button>
      </div>
    </div>

    <div class="notification-list">
      <div
        *ngFor="let notification of notifications"
        class="notification-item"
        [class.unread]="!notification.read"
        (click)="markAsRead(notification.id)"
      >
        <div class="notification-icon">
          {{getNotificationIcon(notification.type)}}
        </div>
        <div class="notification-content">
          <div class="notification-title">{{notification.title}}</div>
          <div class="notification-message">{{notification.message}}</div>
          <div class="notification-time">{{notification.timestamp | date:'short'}}</div>
        </div>
        <button
          class="notification-remove"
          (click)="removeNotification(notification.id); $event.stopPropagation()"
        >
          ×
        </button>
      </div>

      <div *ngIf="notifications.length === 0" class="no-notifications">
        No notifications
      </div>
    </div>
  </div>
</div>
```

### Live Data Updates Service

Create a service for live data synchronization:

```bash
ng generate service live-data
```

**src/app/services/live-data.service.ts:**

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService, WebSocketMessage } from './websocket.service';

export interface LiveDataItem {
  id: string;
  data: any;
  lastUpdated: number;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {
  private dataSubjects = new Map<string, BehaviorSubject<LiveDataItem[]>>();
  private dataVersions = new Map<string, number>();

  constructor(private wsService: WebSocketService) {
    // Subscribe to WebSocket messages for live updates
    this.wsService.messages.subscribe(message => {
      this.handleWebSocketMessage(message);
    });
  }

  getDataStream(collection: string): Observable<LiveDataItem[]> {
    if (!this.dataSubjects.has(collection)) {
      this.dataSubjects.set(collection, new BehaviorSubject<LiveDataItem[]>([]));
    }
    return this.dataSubjects.get(collection)!.asObservable();
  }

  updateData(collection: string, items: LiveDataItem[]): void {
    if (!this.dataSubjects.has(collection)) {
      this.dataSubjects.set(collection, new BehaviorSubject<LiveDataItem[]>([]));
    }
    this.dataSubjects.get(collection)!.next(items);
    this.dataVersions.set(collection, Math.max(...items.map(item => item.version), 0));
  }

  addItem(collection: string, item: LiveDataItem): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const updatedItems = [...currentItems, item];
    this.updateData(collection, updatedItems);

    // Send to server via WebSocket
    this.wsService.sendMessage({
      type: 'data_update',
      payload: {
        collection,
        action: 'add',
        item
      },
      timestamp: Date.now()
    });
  }

  updateItem(collection: string, itemId: string, updates: Partial<LiveDataItem>): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, ...updates, lastUpdated: Date.now() } : item
    );
    this.updateData(collection, updatedItems);

    // Send to server via WebSocket
    this.wsService.sendMessage({
      type: 'data_update',
      payload: {
        collection,
        action: 'update',
        itemId,
        updates
      },
      timestamp: Date.now()
    });
  }

  removeItem(collection: string, itemId: string): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.updateData(collection, updatedItems);

    // Send to server via WebSocket
    this.wsService.sendMessage({
      type: 'data_update',
      payload: {
        collection,
        action: 'remove',
        itemId
      },
      timestamp: Date.now()
    });
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    if (message.type === 'data_update') {
      const { collection, action, item, itemId, updates } = message.payload;

      switch (action) {
        case 'add':
          if (item) {
            this.addItemToCollection(collection, item);
          }
          break;
        case 'update':
          if (itemId && updates) {
            this.updateItemInCollection(collection, itemId, updates);
          }
          break;
        case 'remove':
          if (itemId) {
            this.removeItemFromCollection(collection, itemId);
          }
          break;
        case 'sync':
          if (item) {
            this.syncCollection(collection, item);
          }
          break;
      }
    }
  }

  private addItemToCollection(collection: string, item: LiveDataItem): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const existingIndex = currentItems.findIndex(i => i.id === item.id);

    if (existingIndex === -1) {
      const updatedItems = [...currentItems, item];
      this.updateData(collection, updatedItems);
    } else {
      // Update existing item if newer version
      const existingItem = currentItems[existingIndex];
      if (item.version > existingItem.version) {
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = item;
        this.updateData(collection, updatedItems);
      }
    }
  }

  private updateItemInCollection(collection: string, itemId: string, updates: Partial<LiveDataItem>): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, ...updates, lastUpdated: Date.now() } : item
    );
    this.updateData(collection, updatedItems);
  }

  private removeItemFromCollection(collection: string, itemId: string): void {
    const currentItems = this.dataSubjects.get(collection)?.value || [];
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.updateData(collection, updatedItems);
  }

  private syncCollection(collection: string, items: LiveDataItem[]): void {
    this.updateData(collection, items);
  }
}
```

### Integrating WebSocket with Authentication

Update your authentication service to handle WebSocket connections:

**src/app/services/auth.service.ts:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebSocketService } from './websocket.service';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUser$.asObservable();

  constructor(
    private http: HttpClient,
    private wsService: WebSocketService
  ) {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser$.next(user);
      // Connect WebSocket with token
      this.wsService.connect(user.token);
    }
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser$.next(user);
          // Connect WebSocket with new token
          this.wsService.connect(user.token);
        })
      );
  }

  register(userData: { username: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser$.next(user);
          // Connect WebSocket with new token
          this.wsService.connect(user.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser$.next(null);
    this.wsService.disconnect();
  }

  getToken(): string | null {
    const user = this.currentUser$.value;
    return user?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser$.value;
  }
}
```

### Testing WebSocket Integration

**websocket.service.spec.ts:**

```typescript
import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle connection status changes', (done) => {
    service.connectionStatus.subscribe(connected => {
      if (connected === false) {
        // Initially disconnected
        expect(connected).toBeFalse();
        done();
      }
    });
  });

  it('should send messages when connected', () => {
    spyOn(console, 'warn');
    service.sendMessage({ type: 'test', payload: {} });
    expect(console.warn).toHaveBeenCalledWith('WebSocket not connected, cannot send message');
  });
});
```

**chat.component.spec.ts:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { WebSocketService } from '../../services/websocket.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let wsServiceSpy: jasmine.SpyObj<WebSocketService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WebSocketService', [
      'connectionStatus', 'messages', 'sendChatMessage', 'joinRoom', 'leaveRoom'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: WebSocketService, useValue: spy }]
    }).compileComponents();

    wsServiceSpy = TestBed.inject(WebSocketService) as jasmine.SpyObj<WebSocketService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send message when form is submitted', () => {
    component.chatForm.setValue({ message: 'Test message' });
    component.onSubmit();
    expect(wsServiceSpy.sendChatMessage).toHaveBeenCalledWith('Test message', undefined);
  });
});
```

### Production Configuration

Update your environment files for production:

**src/environments/environment.prod.ts:**

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://192.41.1.117:7000/api',
  wsUrl: 'ws://192.41.1.117:3000'
};
```

**src/environments/environment.ts:**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:7000/api',
  wsUrl: 'ws://localhost:3000'
};
```

### Docker Configuration with WebSocket

Update your Docker setup to support WebSocket connections:

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  angular-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - backend
    environment:
      - API_URL=http://192.41.1.117:7000/api
      - WS_URL=ws://192.41.1.117:3000
    networks:
      - app-network

  backend:
    # Your backend service configuration
    ports:
      - "7000:7000"
    environment:
      - WS_PORT=3000
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Usage in Components

Here's how to use the WebSocket features in your app:

**app.component.html:**

```html
<div class="app-container">
  <app-notification></app-notification>

  <div class="main-content">
    <app-chat [room]="'general'" [username]="currentUser?.username"></app-chat>
  </div>
</div>
```

**app.component.ts:**

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
}
```

Your Angular app now has comprehensive real-time capabilities! The WebSocket integration provides chat, notifications, and live data updates with proper error handling and reconnection logic.

## Docker Configuration

### Development Dockerfile

**Dockerfile.dev:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
```

### Production Dockerfile

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build --prod

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf for Angular SPA:**

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle Angular routing (SPA)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:7000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

### Docker Compose

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  angular-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    # Your backend service configuration
    ports:
      - "7000:7000"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Building and Running

```bash
# Development
docker build -f Dockerfile.dev -t angular-app-dev .
docker run -p 4200:4200 -v $(pwd):/app angular-app-dev

# Production
docker build -t angular-app-prod .
docker run -d -p 80:80 --name angular-app-prod angular-app-prod

# With docker-compose
docker-compose up -d
```

### .dockerignore

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

## Environment Configuration

Create environment files for different configurations:

**src/environments/environment.ts:**

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:7000/api",
};
```

**src/environments/environment.prod.ts:**

```typescript
export const environment = {
  production: true,
  apiUrl: "http://192.41.1.117:7000/api", // Your school server
};
```

**Use in services:**

```typescript
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
```

## Common Issues and Solutions

1. **Port 4200 already in use:**

   ```bash
   ng serve --port 4201
   ```

2. **CORS errors in development:**
   Add proxy configuration in `angular.json` or use a browser extension

3. **Module not found errors:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Build fails:**

   ```bash
   ng build --prod --verbose
   ```

5. **Hot reload not working:**
   Check if file watching is enabled and restart the dev server

## Best Practices

1. **Use TypeScript strictly** - Enable strict mode in `tsconfig.json`
2. **Follow Angular style guide** - Use Angular CLI for generating components
3. **Use reactive forms** for complex forms
4. **Implement lazy loading** for better performance
5. **Use interceptors** for common HTTP concerns
6. **Write unit tests** for components and services
7. **Use environment files** for configuration
8. **Implement proper error handling**
9. **Use Angular Material or Bootstrap** for consistent UI
10. **Follow single responsibility principle** in components and services

## Final Deployment to School Server

Since you're deploying directly without complex web servers, here's your complete setup:

### 1. Build and Deploy

```bash
# Build the production image
docker build -t angular-app-prod .

# Run on your school server
docker run -d -p 4200:80 --name angular-app-prod angular-app-prod

# Check if it's running
docker ps
```

### 2. Environment Setup

Ensure your `environment.prod.ts` has:

```typescript
export const environment = {
  production: true,
  apiUrl: "http://192.41.1.117:7000/api",
};
```

### 3. Access Your App

- Frontend: `http://192.41.1.117:4200`
- Backend: `http://192.41.1.117:7000`

### 4. Troubleshooting

- Check container logs: `docker logs angular-app-prod`
- Stop and restart: `docker stop angular-app-prod && docker start angular-app-prod`
- Remove and redeploy: `docker rm angular-app-prod && docker run -d -p 4200:80 --name angular-app-prod angular-app-prod`

Your Angular app is now ready for production deployment! 🎉
