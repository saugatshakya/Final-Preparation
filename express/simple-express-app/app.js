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
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Socket.IO authentication middleware
const socketAuth = require("./middleware/socketAuth");
io.use(socketAuth);

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

  // Load additional socket handlers
  require("./routes/socket")(socket);
});

// Make io available to routes
app.set("io", io);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Express server is running!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expressdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Temporary test route - REMOVE AFTER TESTING
app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error");
  error.name = "CastError"; // Simulate a CastError
  next(error);
});

// Error handler (must be last)
const errorHandler = require("./middleware/error");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
