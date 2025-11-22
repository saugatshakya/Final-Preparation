const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  console.log("Socket.IO authentication middleware called");
  const token = socket.handshake.auth.token;
  console.log("Token received:", token ? "present" : "missing");

  if (!token) {
    console.log("No token provided, rejecting connection");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.user = decoded;
    console.log("Socket.IO authentication successful for user:", decoded.id);
    next();
  } catch (error) {
    console.log("Socket.IO authentication failed:", error.message);
    next(new Error("Authentication error"));
  }
};

module.exports = socketAuth;
