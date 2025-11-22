# RESTful Web Service Practical Notes

## 1. Add a New Endpoint

### Example:

```js
// routes/students.js
router.get("/getAll", (req, res) => {
  // Fetch all students
  res.send([]);
});
```

## 2. Register Router in app.js

### Example:

```js
const studentRouter = require("./routes/students");
app.use("/students", studentRouter);
```

## 3. Protect Endpoint with Middleware

### Example:

```js
const auth = require("../middleware/auth");
router.get("/getAll", auth, (req, res) => {
  // Protected logic
});
```

## 4. Add a New Model

### Example:

```js
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
module.exports = mongoose.model("Student", studentSchema);
```

## 5. Common Pitfalls

- Not using correct HTTP methods
- Returning wrong status codes
- Not validating input data

## 6. Debugging Tips

- Use Postman to test endpoints
- Check request/response headers
- Log requests in middleware

## 7. Sample Exam Tasks

- Add a new endpoint for students with CRUD operations
- Protect endpoint with middleware
- Add a new model/schema for students
- Implement proper error handling

## 8. Full Example: Student CRUD API

```js
// models/student.js
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 100 },
  grade: { type: String, enum: ["A", "B", "C", "D", "F"] },
});
module.exports = mongoose.model("Student", studentSchema);

// routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const auth = require("../middleware/auth");

// GET /students - Get all students
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /students/:id - Get student by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /students - Create new student
router.post("/", auth, async (req, res) => {
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

// PUT /students/:id - Update student
router.put("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /students/:id - Delete student
router.delete("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

---

Refer to your codebase and slides for more examples.
