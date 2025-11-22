# Express.js Practical Notes

## 1. Add a New API Endpoint

### Step-by-step:

1. Create a new route file (e.g., `routes/students.js`):

   ```js
   const express = require("express");
   const router = express.Router();

   router.get("/getAll", (req, res) => {
     // Fetch all students logic
     res.send([]);
   });

   module.exports = router;
   ```

2. Register the router in `app.js`:
   ```js
   const studentRouter = require("./routes/students");
   app.use("/students", studentRouter);
   ```

## 2. Add Middleware for Protection

### Example:

1. Create `middleware/auth.js`:
   ```js
   function auth(req, res, next) {
     if (req.headers.authorization) next();
     else res.status(401).send("Unauthorized");
   }
   module.exports = auth;
   ```
2. Use middleware in your route:
   ```js
   const auth = require("../middleware/auth");
   router.get("/getAll", auth, (req, res) => {
     // Protected logic
   });
   ```

## 3. Add a New Model

### Example:

1. Create `models/student.js`:
   ```js
   const mongoose = require("mongoose");
   const studentSchema = new mongoose.Schema({
     name: String,
     age: Number,
   });
   module.exports = mongoose.model("Student", studentSchema);
   ```
2. Use the model in your route:
   ```js
   const Student = require("../models/student");
   // In route handler
   Student.find().then((students) => res.send(students));
   ```

## 4. Common Pitfalls

- Forgetting to call `next()` in middleware
- Not handling errors properly
- Exposing sensitive data in responses

## 5. Debugging Tips

- Use `console.log` for debugging
- Check network tab in browser dev tools
- Use Postman for API testing

## 6. Sample Exam Tasks

- Add a new endpoint for students
- Protect endpoint with middleware
- Add a new model/schema for students

## 7. Full Example: Student Management API

```js
// models/student.js
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  grade: String,
});
module.exports = mongoose.model("Student", studentSchema);

// routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const auth = require("../middleware/auth");

router.get("/getAll", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", auth, async (req, res) => {
  const student = new Student({
    name: req.body.name,
    age: req.body.age,
    grade: req.body.grade,
  });
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

// app.js
const studentRouter = require("./routes/students");
app.use("/students", studentRouter);
```

## 10. Troubleshooting Guide

### Common Issues:

- **Route not found:** Check if router is properly registered in app.js
- **Middleware not working:** Ensure middleware is called before route handler
- **Database connection failed:** Verify MongoDB connection string and mongoose setup
- **CORS errors:** Add CORS middleware or headers

### Debugging Steps:

1. Check console logs for error messages
2. Use Postman to test endpoints individually
3. Verify middleware execution order
4. Check database queries and responses

## 11. Integration Examples

### Full User Management System

```js
// models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
module.exports = mongoose.model("User", userSchema);

// middleware/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };

// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

## 12. Best Practices

- Use environment variables for sensitive data
- Implement proper error handling
- Validate input data
- Use async/await for database operations
- Implement rate limiting for APIs
- Use HTTPS in production

---

Refer to your codebase and slides for more examples.
