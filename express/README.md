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

CMD ["npm", "start"]
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
docker-compose up -d
```

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

Real-time communication is essential for modern web applications. Socket.IO provides WebSocket functionality with fallbacks for older browsers.

### 1. Install Socket.IO

```bash
npm install socket.io
```

### 2. Update app.js for Socket.IO

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
    origin: "http://localhost:4200", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

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

For production scaling across multiple server instances:

```bash
npm install socket.io-redis redis
```

**Update app.js:**

```javascript
const redisAdapter = require("socket.io-redis");

// ... existing code ...

// Redis adapter for scaling
io.adapter(
  redisAdapter({
    host: "localhost",
    port: 6379,
  })
);

// ... rest of code ...
```

### 6. Docker Compose with Redis

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

### 7. Testing Socket.IO

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

### 8. Socket.IO Events Reference

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

### 9. Production Considerations

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

Your Express app now supports real-time communication! 🎉
