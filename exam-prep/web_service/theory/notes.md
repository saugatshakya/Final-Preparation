# RESTful Web Service Theory Notes

## 1. Introduction

REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful services use HTTP methods to operate on resources.

## 2. REST Principles

- Stateless: Each request contains all information needed
- Resource-based: URLs represent resources
- HTTP methods: GET, POST, PUT, DELETE

## 3. API Design

- Endpoints: `/users`, `/students`, etc.
- Verbs: GET (read), POST (create), PUT (update), DELETE (remove)
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)

### Example:

```js
// GET all students
router.get("/students", (req, res) => {
  // Fetch students
});

// POST new student
router.post("/students", (req, res) => {
  // Add student
});
```

## 4. Middleware

Middleware functions handle authentication, logging, error handling, etc.

### Example:

```js
function auth(req, res, next) {
  if (req.headers.authorization) next();
  else res.status(401).send("Unauthorized");
}
```

## 5. Models

Models define the structure of data, often using Mongoose for MongoDB.

### Example:

```js
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const Student = mongoose.model("Student", studentSchema);
```

## 6. HTTP Status Codes

- 200 OK: Success
- 201 Created: Resource created
- 400 Bad Request: Invalid request
- 401 Unauthorized: Authentication required
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

## 7. Content Negotiation

Handle different content types (JSON, XML).

### Example:

```js
app.get("/api/users", (req, res) => {
  const accept = req.get("Accept");
  if (accept === "application/xml") {
    res.type("application/xml");
    res.send("<users>...</users>");
  } else {
    res.json(users);
  }
});
```

## 8. Useful Exam Patterns

- Add new endpoint: Create route, add to app.js
- Protect endpoint: Use middleware
- Add model: Create schema in models/

## 9. Sample Exam Q&A

**Q: What is REST?**
A: Architectural style for networked applications using HTTP methods.

**Q: How do you add a new endpoint?**
A: Create route in routes/, import and use in app.js.

**Q: How do you protect an endpoint?**
A: Use middleware in route definition.

**Q: What are HTTP status codes?**
A: Codes indicating the result of an HTTP request.

**Q: What is content negotiation?**
A: Serving different representations of a resource based on client preferences.

## 10. Debugging Tips

- Use API testing tools like Postman
- Check HTTP status codes and headers
- Review request/response payloads
- Test different content types

## 11. Sample Exam Tasks

- Explain REST principles and constraints
- Describe HTTP methods and their uses
- Discuss API design best practices
- Explain content negotiation

---

Refer to your slides (Restful-1.pdf, Restful-2.pdf, Express_Node-Backend.pptx.pdf) for diagrams and more examples.
