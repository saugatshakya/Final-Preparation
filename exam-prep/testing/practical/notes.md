# Testing Practical Notes

## 1. Angular Unit Testing
### Example:
```typescript
describe('LoginComponent', () => {
	it('should create', () => {
		const fixture = TestBed.createComponent(LoginComponent);
		const comp = fixture.componentInstance;
		expect(comp).toBeTruthy();
	});
});
```
Run tests: `ng test`

## 2. React Unit Testing
### Example:
```jsx
import { render, screen } from '@testing-library/react';
import App from './App';
test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
```
Run tests: `npm test`

## 3. Use Mocks/Stubs
Mock dependencies to isolate tests.

## 4. Common Pitfalls
- Not waiting for async operations
- Testing implementation instead of behavior
- Not cleaning up after tests

## 5. Debugging Tips
- Run tests individually
- Check test output for errors
- Use console.log in tests

## 6. Sample Exam Tasks
- Write a unit test for a component/service
- Use mocks for dependencies
- Test async operations
- Achieve good test coverage

## 7. Full Example: Testing User Service
### Angular:
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### React:
```jsx
// UserService.test.js
import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
import * as api from './api';

jest.mock('./api');

test('renders user list', async () => {
  const mockUsers = [{ id: 1, name: 'John' }];
  api.fetchUsers.mockResolvedValue(mockUsers);

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

---
Refer to your codebase and slides for more examples.
