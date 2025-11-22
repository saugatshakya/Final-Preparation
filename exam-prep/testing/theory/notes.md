# Testing Theory Notes

## 1. Introduction
Testing ensures your code works as expected and helps prevent bugs.

## 2. Types of Testing
- Unit Testing: Test individual functions/components
- Integration Testing: Test interactions between modules
- End-to-End (E2E) Testing: Simulate user flows

## 3. Tools
- Angular: Jasmine, Karma
- React: Jest
- E2E: Cypress, Selenium

## 4. Test-Driven Development (TDD)
Write tests before writing code. Red-Green-Refactor cycle.

## 5. Coverage & Best Practices
- Aim for high coverage, but focus on critical paths
- Write clear, independent tests
- Use mocks/stubs for dependencies

## 6. Example: Angular Unit Test
```typescript
describe('AppComponent', () => {
	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
```

## 7. Example: React Unit Test
```jsx
import { render, screen } from '@testing-library/react';
import App from './App';
test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
```

## 8. Mocking and Stubbing
Use mocks to isolate units under test.

### Example (Jest):
```jsx
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked value');
```

## 9. Test Coverage
Measure how much code is tested.

### Example:
```bash
# Generate coverage report
npm test -- --coverage
```

## 10. Useful Exam Patterns
- Write unit tests for components/services
- Use mocks for dependencies
- Use CLI tools: `ng test`, `npm test`

## 11. Sample Exam Q&A
**Q: What is unit testing?**
A: Testing individual functions/components in isolation.

**Q: What is TDD?**
A: Writing tests before code, following Red-Green-Refactor.

**Q: What is mocking?**
A: Replacing dependencies with fake implementations for testing.

**Q: How do you measure test coverage?**
A: Use coverage tools to see percentage of code tested.

## 13. Debugging Tips
- Run tests individually to isolate issues
- Check test setup and teardown
- Review mock implementations
- Use debugging tools in test environment

## 14. Sample Exam Tasks
- Explain different types of testing
- Describe TDD methodology
- Discuss test coverage importance
- Explain mocking and stubbing

---
Refer to your slides (Developer Testing-1.pdf, Developer Testing-2.pdf, Testing.pptx.pdf) for diagrams and more examples.
