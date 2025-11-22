# Angular Theory Notes

## 1. Introduction

Angular is a TypeScript-based open-source web application framework for building SPA (Single Page Applications).

## 2. Components

Components are the building blocks of Angular applications. Each component consists of a TypeScript class, HTML template, and CSS styles.

### Example:

```typescript
// app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "My Angular App";
}
```

## 3. Routing

Routing allows navigation between different components/views.

### Example:

```typescript
// app.routes.ts
import { Routes } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";

export const routes: Routes = [
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard] },
];
```

## 4. Guards (canActivate)

Guards are used to protect routes from unauthorized access.

### Example:

```typescript
// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return !!localStorage.getItem("token");
  }
}
```

## 5. Localstorage

Used to store authentication tokens and user data.

### Example:

```typescript
// Save token
localStorage.setItem("token", userToken);
// Retrieve token
const token = localStorage.getItem("token");
```

## 6. Unit Testing

Angular uses Jasmine and Karma for unit testing.

### Example:

```typescript
// app.component.spec.ts
describe("AppComponent", () => {
  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

### Testing Services

```typescript
describe("UserService", () => {
  let service: UserService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
```

## 7. Dependency Injection

Angular's DI system provides dependencies to components and services.

### Example:

```typescript
@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}
}
```

## 8. Observables and RxJS

Angular uses RxJS for handling asynchronous operations.

### Example:

```typescript
import { Observable } from 'rxjs';

getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users');
}
```

## 9. Useful Exam Patterns

- Create a component: `ng g c ComponentName`
- Add a route: Edit `app.routes.ts`
- Protect route: Use `canActivate` guard
- Use localstorage for authentication
- Write unit tests for components/services

## 10. Sample Exam Q&A

**Q: How do you create a new component in Angular?**
A: Use Angular CLI: `ng g c ComponentName`

**Q: How do you protect a route?**
A: Use `canActivate` guard in route definition.

**Q: How do you store/retrieve tokens?**
A: Use `localStorage.setItem` and `localStorage.getItem`.

**Q: What is dependency injection in Angular?**
A: A design pattern where dependencies are provided to components/services.

**Q: How do you handle asynchronous operations?**
A: Use Observables and RxJS.

## 11. Debugging Tips

- Use Angular DevTools browser extension
- Check component lifecycle hooks execution
- Review dependency injection tree
- Verify route guard implementations

## 12. Sample Exam Tasks

- Explain Angular's component architecture
- Describe the routing system and guards
- Discuss dependency injection and services
- Explain unit testing in Angular

## 13. Key Takeaways

- Angular is a component-based framework using TypeScript
- Components consist of TypeScript class, HTML template, and CSS
- Routing enables navigation between components
- Guards protect routes from unauthorized access
- Services provide shared functionality and data management

## 14. Advanced Concepts

### Reactive Forms

```typescript
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Submit form
    }
  }
}
```

### HTTP Interceptors

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req);
  }
}
```

### Component Communication

```typescript
// Parent component
export class ParentComponent {
  @Output() dataEvent = new EventEmitter<string>();

  sendData() {
    this.dataEvent.emit("Hello from parent");
  }
}

// Child component
export class ChildComponent {
  @Input() data: string;
}
```

## 15. Common Exam Scenarios

- Create components with forms and validation
- Implement routing with guards
- Manage authentication state with localStorage
- Write unit tests for components and services
- Handle HTTP requests with error handling

---

Refer to your slides (Angular-2025.pptx.pdf, Authentication.pptx.pdf) for diagrams and more examples.
