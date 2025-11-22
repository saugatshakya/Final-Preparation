# Express.js Theory Notes

## 1. Introduction

Express.js is a minimal and flexible Node.js web application framework that provides robust features for building web and mobile applications.

## 2. Routing

Routing refers to how an application responds to client requests to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, etc).

### Example:

```js
const express = require("express");
const router = express.Router();

// GET endpoint
router.get("/users", (req, res) => {
  res.send("Get all users");
});

// POST endpoint
router.post("/users", (req, res) => {
  // Add user logic
  res.send("User added");
});
```

## 3. Middleware

Middleware are functions that execute during the lifecycle of a request to the Express server. They can modify the request and response objects, end the request-response cycle, or call the next middleware in the stack.

### Example:

```js
function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

router.get("/protected", authMiddleware, (req, res) => {
  res.send("Protected route");
});
```

## 4. Models

Models define the structure of your data. In Express apps using MongoDB, Mongoose is commonly used to define schemas and interact with the database.

### Example:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
```

## 5. CRUD Operations

```js
// Create
const newUser = new User({
  username: "john",
  password: "pass",
  email: "john@example.com",
});
newUser.save();

// Read
User.find().then((users) => console.log(users));

// Update
User.findByIdAndUpdate(id, { username: "johnny" });

// Delete
User.findByIdAndDelete(id);
```

## 6. Application Structure

- `routes/`: Contains route definitions (e.g., users.js, students.js)
- `models/`: Contains data models (e.g., user.js)
- `middleware/`: Contains middleware functions (e.g., auth.js)
- `app.js`: Main application file
- `bin/www`: Server startup script

## 7. Protecting Endpoints

To protect endpoints, use middleware in your route definitions:

```js
router.get("/students", authMiddleware, (req, res) => {
  // Only accessible if authenticated
});
```

## 8. Error Handling

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

## 9. Useful Exam Patterns

- Add a new endpoint: Create a new route file, import and use in app.js
- Add middleware: Create function in middleware/auth.js, use in route
- Add model: Create schema in models/, import and use in routes

## 10. Sample Exam Q&A

**Q: How do you add a new API endpoint in Express?**
A: Create a new route in routes/ (e.g., students.js), export router, import and use in app.js:

```js
const studentRouter = require("./routes/students");
app.use("/students", studentRouter);
```

**Q: How do you protect an endpoint?**
A: Use middleware in the route definition.

**Q: How do you define a new model?**
A: Use Mongoose to create a schema and model in models/.

**Q: What is middleware in Express?**
A: Functions that have access to request, response, and next middleware function.

**Q: How do you handle errors in Express?**
A: Use error-handling middleware with four parameters (err, req, res, next).

## 10. Debugging Tips

- Review Express documentation for unfamiliar concepts
- Draw diagrams of request flow through middleware
- Compare your code with working examples from slides
- Check middleware execution order

## 11. Sample Exam Tasks

- Explain the role of middleware in Express applications
- Describe how routing works and the purpose of route parameters
- Discuss the importance of models and schemas in Express apps
- Explain error handling middleware and its parameters

## 12. Key Takeaways

- Express is middleware-based framework for Node.js
- Routes handle HTTP requests with methods like GET, POST, PUT, DELETE
- Middleware functions process requests before reaching route handlers
- Models define data structures using Mongoose schemas
- Error handling middleware catches and processes errors

## 13. Advanced Concepts

### Route Parameters and Query Strings

```js
// Route parameters
router.get("/users/:id", (req, res) => {
  const userId = req.params.id;
});

// Query parameters
router.get("/users", (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
});
```

### Custom Middleware

```js
function logger(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
}

function corsHandler(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}
```

### Input Validation

```js
const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).max(120),
});

router.post("/users", (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Continue with user creation
});
```

## 14. Common Exam Scenarios

- Implement CRUD operations for a resource
- Add authentication middleware to protect routes
- Create and validate new data models
- Handle different HTTP methods and status codes
- Implement error handling and logging
