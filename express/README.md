# Simple Express.js Crash Course

This guide will help you create a basic Express.js application with MongoDB, Docker, and essential backend concepts.

## Prerequisites

- Node.js installed
- Docker (optional, for containerization)
- Basic JavaScript knowledge

## Quick Start

### 1. Create Project

```bash
mkdir simple-express-app
cd simple-express-app
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install -D nodemon
```

### 3. Create Basic Files

**app.js** (main server file):

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Express server is running!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expressdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**.env** (environment variables):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expressdb
JWT_SECRET=your-secret-key-here
```

**package.json** scripts:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see `{"message": "Express server is running!"}`

## Models

Models define your data structure and interact with MongoDB.

**models/User.js**:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

**models/Post.js**:

```javascript
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
```

## API Endpoints & Routes

### Creating Routes

**routes/auth.js** (authentication routes):

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
```

**routes/posts.js** (posts routes):

```javascript
const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create post (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id,
    });

    await post.save();
    await post.populate("author", "name email");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
```

### Register Routes in app.js

```javascript
// ... existing code ...

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ... rest of app.js ...
```

## Middleware

Middleware functions intercept requests and can modify req/res or call next().

**middleware/auth.js** (authentication middleware):

```javascript
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
```

**Protecting Endpoints**:

```javascript
// In routes/posts.js
const auth = require("../middleware/auth");

// This route requires authentication
router.post("/", auth, async (req, res) => {
  // Only authenticated users can create posts
  // req.user.id is available here
});
```

## Docker Setup (Simple)

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### docker-compose.yml (with MongoDB)

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/expressdb
      - JWT_SECRET=your-secret-key
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=expressdb
```

### Run with Docker

```bash
# Initial build
docker-compose up --build

# For development (after initial build), just run:
docker-compose up
```

**Note:** The volume mounting allows code changes to be reflected immediately without rebuilding. The Dockerfile uses `npm run dev` (nodemon) for live reloading during development. Only rebuild when you change dependencies in `package.json`.

## Testing Your API

### Register a user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create a post (use token from login):

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Post","content":"Hello World!"}'
```

### Get all posts:

```bash
curl http://localhost:3000/api/posts
```

## Project Structure

```
simple-express-app/
├── models/
│   ├── User.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   └── posts.js
├── middleware/
│   └── auth.js
├── app.js
├── package.json
├── .env
└── Dockerfile (optional)
```

## Common Issues & Solutions

1. **MongoDB Connection Error**: Make sure MongoDB is running
2. **JWT Token Issues**: Check your JWT_SECRET in .env
3. **CORS Errors**: Add `app.use(cors())` in app.js
4. **Port Already in Use**: Change PORT in .env

## Next Steps

### Input Validation with express-validator

**⚠️ Important:** You must install express-validator before using this validation code.

**Install express-validator:**

```bash
npm install express-validator
```

**Add validation to routes:**

```javascript
// routes/auth.js
const { body, validationResult } = require("express-validator");

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ... rest of registration logic
  }
);
```

### Testing Input Validation Immediately

**⚠️ Quick Test Commands - Try these right after implementing express-validator:**

**1. Test validation with invalid data:**

```bash
# Test short name
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"test@example.com","password":"password123"}'

# Test invalid email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"invalid-email","password":"password123"}'

# Test short password
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123"}'
```

**2. Test validation with Node.js script:**

```javascript
// test-validation.js
async function testInputValidation() {
  try {
    console.log("Testing input validation...\n");

    const testCases = [
      {
        name: "Short name",
        data: {
          name: "A",
          email: "test1@example.com",
          password: "password123",
        },
        expectError: true,
      },
      {
        name: "Invalid email",
        data: {
          name: "Test User",
          email: "not-an-email",
          password: "password123",
        },
        expectError: true,
      },
      {
        name: "Short password",
        data: {
          name: "Test User",
          email: "test2@example.com",
          password: "123",
        },
        expectError: true,
      },
      {
        name: "Valid data",
        data: {
          name: "Valid User",
          email: "valid@example.com",
          password: "validpassword123",
        },
        expectError: false,
      },
    ];

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCase.data),
      });

      const data = await response.json();

      if (testCase.expectError) {
        if (response.status === 400 && data.errors) {
          console.log(
            "✓ Validation error as expected:",
            data.errors.map((e) => e.msg).join(", ")
          );
        } else {
          console.log(
            "✗ Expected validation error but got:",
            response.status,
            data
          );
        }
      } else {
        if (response.status === 201 && data.token) {
          console.log("✓ Registration successful as expected");
        } else {
          console.log(
            "✗ Expected successful registration but got:",
            response.status,
            data
          );
        }
      }
      console.log();
    }
  } catch (error) {
    console.error("Validation test failed:", error);
  }
}

testInputValidation();
```

**3. Test multiple validation errors:**

```bash
# Send request with multiple invalid fields
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid","password":"12"}'
```

**4. Test custom validation messages:**

```javascript
// Test with browser console
fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "X", // Too short
    email: "bad-email", // Invalid format
    password: "pass", // Too short
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Validation errors:", data.errors));
```

**Expected Output:**

- Short name: `400` with "Name must be at least 2 characters"
- Invalid email: `400` with "Invalid email"
- Short password: `400` with "Password must be at least 6 characters"
- Valid data: `201` with token and user object
- Multiple errors: Array of all validation error messages

### Error Handling Middleware

**middleware/error.js:**

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
```

**Use in app.js:**

```javascript
// ... routes ...

// Error handler (must be last)
const errorHandler = require("./middleware/error");
app.use(errorHandler);
```

### Testing Error Handling Immediately

**⚠️ Quick Test Commands - Try these right after implementing error handling:**

**1. Test invalid MongoDB ObjectId:**

```bash
# Try to get a post with invalid ID
curl http://localhost:3000/api/posts/invalid-id-123
```

**2. Test duplicate key error:**

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"duplicate@example.com","password":"password123"}'

# Try to register again with same email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User 2","email":"duplicate@example.com","password":"password123"}'
```

**3. Test validation errors with Node.js:**

```javascript
// test-errors.js
async function testErrorHandling() {
  try {
    console.log("Testing various error scenarios...\n");

    // Test 1: Invalid ObjectId
    console.log("1. Testing invalid ObjectId:");
    const invalidIdResponse = await fetch(
      "http://localhost:3000/api/posts/invalid-object-id"
    );
    const invalidIdData = await invalidIdResponse.json();
    console.log("Status:", invalidIdResponse.status);
    console.log("Response:", invalidIdData);
    console.log();

    // Test 2: Duplicate email registration
    console.log("2. Testing duplicate email:");
    // First registration
    await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Error Test User",
        email: "error-test@example.com",
        password: "password123",
      }),
    });

    // Second registration with same email
    const duplicateResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Error Test User 2",
          email: "error-test@example.com",
          password: "password123",
        }),
      }
    );
    const duplicateData = await duplicateResponse.json();
    console.log("Status:", duplicateResponse.status);
    console.log("Response:", duplicateData);
    console.log();

    // Test 3: Invalid route (should return 404)
    console.log("3. Testing invalid route:");
    const notFoundResponse = await fetch(
      "http://localhost:3000/api/nonexistent-route"
    );
    console.log("Status:", notFoundResponse.status);
    try {
      const notFoundData = await notFoundResponse.json();
      console.log("Response:", notFoundData);
    } catch (e) {
      console.log("Response: (not JSON)");
    }
  } catch (error) {
    console.error("Error handling test failed:", error);
  }
}

testErrorHandling();
```

**4. Test server errors:**

```bash
# Test with malformed JSON
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"invalid": json}'

# Test with missing required fields (if validation is implemented)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

**Expected Output:**

- Invalid ObjectId: `404` with "Resource not found"
- Duplicate key: `400` with "Duplicate field value entered"
- Invalid route: `404` (Express default) or custom error
- Malformed JSON: `400` or `500` depending on middleware
- Validation errors: `400` with validation messages

### Password Reset Functionality

**Add reset routes to auth.js:**

```javascript
const crypto = require("crypto");

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// routes/auth.js
router.post("/forgotpassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Send email (implement email service)
  // const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

  res.json({ message: "Email sent", resetToken });
});

router.put("/resetpassword/:resettoken", async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid token" });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});
```

### Testing Password Reset Immediately

**⚠️ Quick Test Commands - Try these right after implementing password reset:**

**1. Test forgot password flow:**

```bash
# Register a test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Reset Test","email":"reset@example.com","password":"oldpassword"}'

# Request password reset
RESET_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{"email":"reset@example.com"}')

echo "Reset response: $RESET_RESPONSE"

# Extract reset token (in real app, this would come via email)
RESET_TOKEN=$(echo $RESET_RESPONSE | jq -r '.resetToken')
echo "Reset token: $RESET_TOKEN"
```

**2. Test password reset with Node.js:**

```javascript
// test-password-reset.js
async function testPasswordReset() {
  try {
    // Register user
    await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Password Reset Test",
        email: "reset-test@example.com",
        password: "oldpassword123",
      }),
    });

    // Request password reset
    const forgotResponse = await fetch(
      "http://localhost:3000/api/auth/forgotpassword",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "reset-test@example.com",
        }),
      }
    );

    const forgotData = await forgotResponse.json();
    console.log("Forgot password response:", forgotData);

    if (forgotData.resetToken) {
      // Reset password
      const resetResponse = await fetch(
        `http://localhost:3000/api/auth/resetpassword/${forgotData.resetToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: "newpassword123",
          }),
        }
      );

      const resetData = await resetResponse.json();
      console.log("Password reset response:", resetData);

      // Test login with new password
      const loginResponse = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "reset-test@example.com",
            password: "newpassword123",
          }),
        }
      );

      const loginData = await loginResponse.json();
      console.log(
        "Login with new password:",
        loginData.token ? "Success" : "Failed"
      );
    }
  } catch (error) {
    console.error("Password reset test failed:", error);
  }
}

testPasswordReset();
```

**3. Test invalid reset token:**

```bash
# Try to reset with invalid token
curl -X PUT http://localhost:3000/api/auth/resetpassword/invalid-token \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword"}'
```

**4. Test expired token (wait 10+ minutes after requesting reset):**

```bash
# This should fail after token expires
curl -X PUT http://localhost:3000/api/auth/resetpassword/$RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword"}'
```

**5. Test non-existent email:**

```bash
curl -X POST http://localhost:3000/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com"}'
```

**Expected Output:**

- Forgot password: `{"message": "Email sent", "resetToken": "..."}`
- Valid reset: `{"message": "Password reset successful"}`
- Invalid token: `{"error": "Invalid token"}`
- Non-existent email: `{"error": "User not found"}`
- Login with new password: Should return valid JWT token

### File Upload with Multer

**Install multer:**

```bash
npm install multer
```

**middleware/upload.js:**

```javascript
const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
```

**Use in routes:**

```javascript
// routes/users.js
const upload = require("../middleware/upload");

router.post("/upload", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file" });
  }

  // Save file path to user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.path },
    { new: true }
  );

  res.json({ user });
});
```

### Testing File Upload Immediately

**⚠️ Quick Test Commands - Try these right after implementing file upload:**

**1. Create test image file:**

```bash
# Create a simple test image (1x1 pixel PNG)
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test-image.png
```

**2. Test file upload with curl:**

```bash
# First register and login to get token
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Upload file
curl -X POST http://localhost:3000/api/users/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test-image.png" \
  -H "Content-Type: multipart/form-data"
```

**3. Test file upload with Node.js script:**

```javascript
// Create test-upload.js
const fs = require("fs");
const path = require("path");

// First get authentication token
async function testFileUpload() {
  try {
    // Register user
    const registerResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Upload Test User",
          email: "upload@example.com",
          password: "password123",
        }),
      }
    );
    const registerData = await registerResponse.json();
    const token = registerData.token;

    // Create a simple test file
    const testFilePath = path.join(__dirname, "test-upload.txt");
    fs.writeFileSync(testFilePath, "This is a test file for upload");

    // Upload file
    const formData = new FormData();
    formData.append("avatar", fs.createReadStream(testFilePath));

    const uploadResponse = await fetch(
      "http://localhost:3000/api/users/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await uploadResponse.json();
    console.log("Upload result:", result);

    // Cleanup
    fs.unlinkSync(testFilePath);
  } catch (error) {
    console.error("Upload test failed:", error);
  }
}

testFileUpload();
```

**4. Test invalid file type:**

```bash
# Create a text file
echo "This is not an image" > not-an-image.txt

# Try to upload (should fail)
curl -X POST http://localhost:3000/api/users/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@not-an-image.txt"
```

**Expected Output:**

- Success: `{"user": {"_id": "...", "avatar": "uploads/avatar-123456789.png"}}`
- Invalid file: `{"error": "Error: Images Only!"}`
- No file: `{"error": "Please upload a file"}`

### Admin Routes and Middleware

**middleware/admin.js:**

```javascript
const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin role required." });
  }
  next();
};

module.exports = admin;
```

**routes/admin.js:**

```javascript
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(auth);
router.use(admin);

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
});

module.exports = router;
```

**Register admin routes in app.js:**

```javascript
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
```

### Testing Admin Routes Immediately

**⚠️ Quick Test Commands - Try these right after implementing admin routes:**

**1. Create admin and regular users:**

```bash
# Create admin user (manually set role in database or add role field to registration)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123"}'

# Create regular user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Regular User","email":"user@example.com","password":"user123"}'
```

**2. Test admin access (assuming you have admin role logic):**

```javascript
// test-admin.js - Node.js script for admin testing
async function testAdminRoutes() {
  try {
    // Login as admin
    const adminLogin = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123",
      }),
    });
    const adminData = await adminLogin.json();
    const adminToken = adminData.token;

    // Login as regular user
    const userLogin = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "user123",
      }),
    });
    const userData = await userLogin.json();
    const userToken = userData.token;

    console.log("Admin token:", adminToken ? "Received" : "Failed");
    console.log("User token:", userToken ? "Received" : "Failed");

    // Test admin routes with admin token
    const adminUsers = await fetch("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("Admin get users:", adminUsers.status);

    // Test admin routes with regular user token (should fail)
    const userAdminAccess = await fetch(
      "http://localhost:3000/api/admin/users",
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    console.log("User admin access (should fail):", userAdminAccess.status);
  } catch (error) {
    console.error("Admin test failed:", error);
  }
}

testAdminRoutes();
```

**3. Test admin operations with curl:**

```bash
# Login as admin
ADMIN_TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

# Get all users (admin only)
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Try with regular user token (should fail)
USER_TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}' \
  | jq -r '.token')

curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $USER_TOKEN"
```

**4. Test user management:**

```bash
# Get user ID from previous response
USER_ID="REPLACE_WITH_ACTUAL_USER_ID"

# Update user role
curl -X PUT http://localhost:3000/api/admin/users/$USER_ID/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"moderator"}'

# Delete user
curl -X DELETE http://localhost:3000/api/admin/users/$USER_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Output:**

- Admin access: `200 OK` with user list
- Regular user access: `403 Forbidden` with "Access denied. Admin role required."
- Role update: `200 OK` with updated user object
- Delete user: `200 OK` with "User deleted"

### Testing with Jest and Supertest

**Install testing dependencies:**

```bash
npm install -D jest supertest
```

**tests/auth.test.js:**

```javascript
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should not register user with existing email", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe("User already exists");
    });
  });
});
```

**Update package.json scripts:**

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

### Complete Project Structure

```
simple-express-app/
├── middleware/
│   ├── auth.js
│   ├── admin.js
│   ├── error.js
│   └── upload.js
├── models/
│   ├── User.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   └── admin.js
├── tests/
│   ├── auth.test.js
│   └── posts.test.js
├── uploads/          # For file uploads
├── app.js
├── package.json
├── .env
├── Dockerfile
└── docker-compose.yml
```

Happy coding! 🚀

## WebSocket Integration with Socket.IO

**⚠️ CRITICAL FIXES INCLUDED:**

- Static file serving middleware (`app.use(express.static('public'))`)
- Server startup with `server.listen()` instead of `app.listen()`
- Volume mounting in docker-compose.yml for file access
- Complete test HTML file with authentication

Real-time communication is essential for modern web applications. Socket.IO provides WebSocket functionality with fallbacks for older browsers.

### 1. Install Socket.IO

```bash
npm install socket.io
```

**For Redis scaling (optional):**

```bash
npm install socket.io-redis redis
```

### 2. Update app.js for Socket.IO

**⚠️ Important:** Start with basic Socket.IO first, then add Redis later if needed for scaling.

**Basic Socket.IO setup (without Redis - recommended for development):**

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
  },
});

// Socket.IO authentication middleware
const socketAuth = require("./middleware/socketAuth");
io.use(socketAuth);

// Middleware
app.use(cors());
app.use(express.json());

// CRITICAL: Serve static files so test HTML page works
app.use(express.static("public"));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their own room for private messages
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle chat messages
  socket.on("sendMessage", (data) => {
    const { message, room, sender } = data;

    // Save message to database (optional)
    // const newMessage = new Message({ message, sender, room });
    // await newMessage.save();

    // Broadcast to room
    io.to(room).emit("message", {
      message,
      sender,
      timestamp: new Date(),
    });
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(data.room).emit("userTyping", {
      user: data.user,
      isTyping: true,
    });
  });

  socket.on("stopTyping", (data) => {
    socket.to(data.room).emit("userTyping", {
      user: data.user,
      isTyping: false,
    });
  });

  // Handle notifications
  socket.on("sendNotification", (data) => {
    const { userId, notification } = data;
    io.to(userId).emit("notification", notification);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available to routes
app.set("io", io);

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expressdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server with Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Socket.IO Routes (Optional)

You can also handle socket events in separate route files:

**routes/socket.js**:

```javascript
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Real-time post updates
    socket.on("newPost", async (postData) => {
      try {
        // Save post to database
        const post = new Post(postData);
        await post.save();
        await post.populate("author", "name email");

        // Broadcast new post to all connected clients
        io.emit("postCreated", post);
      } catch (error) {
        socket.emit("error", { message: "Failed to create post" });
      }
    });

    // Real-time comments
    socket.on("addComment", async (commentData) => {
      try {
        const { postId, comment, userId } = commentData;

        // Save comment (assuming you have a Comment model)
        // const comment = new Comment({ postId, comment, userId });
        // await comment.save();

        // Broadcast comment to post room
        io.to(postId).emit("commentAdded", {
          postId,
          comment,
          userId,
          timestamp: new Date(),
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to add comment" });
      }
    });

    // Live user presence
    socket.on("userOnline", (userId) => {
      socket.userId = userId;
      io.emit("userStatusChanged", { userId, status: "online" });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        io.emit("userStatusChanged", {
          userId: socket.userId,
          status: "offline",
        });
      }
    });
  });
};
```

**Update app.js to use socket routes:**

```javascript
// ... existing code ...

// Initialize Socket.IO routes
require("./routes/socket")(io);

// ... rest of app.js ...
```

### 4. Authentication with Socket.IO

**middleware/socketAuth.js**:

```javascript
const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};

module.exports = socketAuth;
```

**Update app.js:**

```javascript
const socketAuth = require("./middleware/socketAuth");

// ... existing code ...

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

// Use authentication middleware
io.use(socketAuth);

// ... rest of socket code ...
```

### 5. Socket.IO with Redis (for scaling)

**⚠️ Redis is optional and only needed for scaling across multiple server instances. Skip this for basic development.**

For production scaling across multiple server instances:

```bash
npm install socket.io-redis redis
```

**Update app.js for Redis (only if you need scaling):**

```javascript
const redisAdapter = require("socket.io-redis");

// ... existing Socket.IO setup ...

// Redis adapter for scaling (only add this if you have Redis running)
io.adapter(redisAdapter({ host: "redis", port: 6379 })); // Use "redis" for Docker service name
```

### 6. Docker Compose with Redis (Optional - only for scaling)

**Skip this section if you're not using Redis for scaling.**

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/expressdb
      - JWT_SECRET=your-secret-key
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=expressdb

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 7. Testing Socket.IO (Unit Tests)

**tests/socket.test.js**:

```javascript
const io = require("socket.io-client");

describe("Socket.IO Tests", () => {
  let socket;

  beforeEach((done) => {
    // Connect to test server
    socket = io("http://localhost:3000", {
      auth: {
        token: "test-token", // Use a valid JWT token
      },
    });
    socket.on("connect", done);
  });

  afterEach(() => {
    socket.disconnect();
  });

  test("should receive connection message", (done) => {
    socket.on("message", (data) => {
      expect(data).toBeDefined();
      done();
    });
  });

  test("should send and receive messages", (done) => {
    const testMessage = "Hello from test!";

    socket.emit("sendMessage", {
      message: testMessage,
      room: "test-room",
    });

    socket.on("message", (data) => {
      expect(data.message).toBe(testMessage);
      done();
    });
  });
});
```

### 8. Testing Socket.IO Immediately

**⚠️ Quick Test Commands - Try these right after implementing Socket.IO:**

**1. Create test directory and HTML file:**

```bash
# Create public directory for static files
mkdir -p public

# Create test HTML file
cat > public/socket-test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket.IO Test Page</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #messages { border: 1px solid #ccc; height: 300px; overflow-y: auto; padding: 10px; margin: 10px 0; background: #f9f9f9; }
        input, button { padding: 8px; margin: 5px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .connected { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .disconnected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>
    <h1>Socket.IO Testing Page</h1>
    <div id="status" class="status disconnected">Disconnected</div>

    <div>
        <input type="text" id="messageInput" placeholder="Type a message..." />
        <input type="text" id="roomInput" placeholder="Room name" value="test-room" />
        <button onclick="sendMessage()">Send Message</button>
        <button onclick="joinRoom()">Join Room</button>
    </div>

    <div>
        <button onclick="startTyping()">Start Typing</button>
        <button onclick="stopTyping()">Stop Typing</button>
    </div>

    <div id="messages"></div>

    <script>
        let authToken = null;
        const messagesDiv = document.getElementById('messages');
        const statusDiv = document.getElementById('status');

        async function authenticate() {
            try {
                addMessage('Authenticating...');
                console.log('Starting authentication...');
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'socket@example.com', password: 'test123' })
                });
                console.log('Auth response status:', response.status);
                const data = await response.json();
                console.log('Auth response data:', data);
                if (data.token) {
                    authToken = data.token;
                    addMessage('Authentication successful!', 'success');
                    console.log('Token received, connecting to Socket.IO...');
                    connectSocketIO();
                } else {
                    addMessage('Authentication failed: ' + (data.error || 'Unknown error'), 'error');
                    console.error('Authentication failed:', data);
                }
            } catch (error) {
                addMessage('Authentication error: ' + error.message, 'error');
                console.error('Authentication error:', error);
            }
        }

        function connectSocketIO() {
            console.log('Connecting to Socket.IO with token:', authToken ? 'present' : 'missing');
            const socket = io({ auth: { token: authToken } });
            window.testSocket = socket;

            socket.on('connect', () => {
                statusDiv.textContent = 'Connected to Socket.IO server!';
                statusDiv.className = 'status connected';
                addMessage('Connected to server!', 'success');
                console.log('Socket.IO connected:', socket.id);
            });

            socket.on('disconnect', () => {
                statusDiv.textContent = 'Disconnected';
                statusDiv.className = 'status disconnected';
                addMessage('Disconnected from server', 'error');
                console.log('Socket.IO disconnected');
            });

            socket.on('connect_error', (error) => {
                statusDiv.textContent = 'Connection Error';
                statusDiv.className = 'status disconnected';
                addMessage('Connection error: ' + error.message, 'error');
                console.error('Socket.IO connection error:', error);
            });

            socket.on('message', (data) => {
                addMessage(`Message from ${data.sender}: ${data.message}`);
            });

            socket.on('userTyping', (data) => {
                addMessage(`${data.user} is typing...`);
            });
        }

        function addMessage(message, type = 'info') {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${new Date().toLocaleTimeString()}:</strong> ${message}`;
            div.style.color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'black';
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function sendMessage() {
            if (!window.testSocket) { addMessage('Not connected to Socket.IO', 'error'); return; }
            const message = document.getElementById('messageInput').value;
            const room = document.getElementById('roomInput').value;
            if (message.trim()) {
                window.testSocket.emit('sendMessage', { message, room, sender: 'BrowserUser' });
                addMessage(`Sent: ${message}`);
                document.getElementById('messageInput').value = '';
            }
        }

        function joinRoom() {
            if (!window.testSocket) { addMessage('Not connected to Socket.IO', 'error'); return; }
            const room = document.getElementById('roomInput').value;
            window.testSocket.emit('join', room);
            addMessage(`Joined room: ${room}`, 'success');
        }

        function startTyping() {
            if (!window.testSocket) { addMessage('Not connected to Socket.IO', 'error'); return; }
            const room = document.getElementById('roomInput').value;
            window.testSocket.emit('typing', { user: 'BrowserUser', room });
            addMessage('Started typing...');
        }

        function stopTyping() {
            if (!window.testSocket) { addMessage('Not connected to Socket.IO', 'error'); return; }
            const room = document.getElementById('roomInput').value;
            window.testSocket.emit('stopTyping', { user: 'BrowserUser', room });
            addMessage('Stopped typing');
        }

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        addMessage('Socket.IO test page loaded. Starting authentication...');
        authenticate();
    </script>
</body>
</html>
EOF
```

**2. Register a test user for authentication:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"SocketTest","email":"socket@example.com","password":"test123"}'
```

**3. Open the test page:**

```
http://localhost:3000/socket-test.html
```

**4. Test Socket.IO features:**

- Messages should appear in the green "Connected" status area
- Send messages and see them appear instantly
- Open the same URL in another tab for real-time testing

### 9. Socket.IO Events Reference

**Common Events:**

- `connection` - Client connects
- `disconnect` - Client disconnects
- `join` - Join a room
- `leave` - Leave a room

**Custom Events (your app):**

- `sendMessage` - Send chat message
- `message` - Receive chat message
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `notification` - Send notification
- `userOnline` - User came online
- `userStatusChanged` - User status changed

### 10. Production Considerations

1. **Use environment variables for Socket.IO config:**

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
```

2. **Implement rate limiting:**

```javascript
const rateLimit = require("express-rate-limit");

// Socket rate limiting
io.use((socket, next) => {
  // Implement your rate limiting logic
  next();
});
```

3. **Handle reconnections gracefully:**

```javascript
socket.on("connect", () => {
  console.log("Connected to server");
  // Rejoin rooms, resubscribe to events
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  // Handle reconnection logic
});
```

4. **Monitor socket connections:**

```javascript
setInterval(() => {
  console.log(`Connected clients: ${io.engine.clientsCount}`);
}, 30000);
```

### Socket.IO Troubleshooting

**"Error: connect ECONNREFUSED 127.0.0.1:6379"**

- **Cause:** Trying to use Redis adapter but Redis isn't running
- **Solution:** Either remove Redis adapter code for basic Socket.IO, or add Redis to docker-compose.yml and use `redis:6379` instead of `localhost:6379`

**"CORS error"**

- **Cause:** Frontend origin not allowed
- **Solution:** Update the `cors.origin` in Socket.IO config to match your frontend URL

**"Socket.IO connection failed"**

- **Cause:** Wrong server URL or port
- **Solution:** Make sure client connects to `http://localhost:3000` (same as Express server)

**For basic development (recommended):**

- Remove all Redis-related code
- Use basic Socket.IO setup
- Add Redis only when scaling to multiple servers
