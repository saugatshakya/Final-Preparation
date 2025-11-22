module.exports = (socket) => {
  // Real-time post updates
  socket.on("newPost", async (postData) => {
    try {
      // Save post to database
      const post = new Post(postData);
      await post.save();
      await post.populate("author", "name email");

      // Broadcast new post to all connected clients
      socket.broadcast.emit("postCreated", post);
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
      socket.to(postId).emit("commentAdded", {
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
    socket.broadcast.emit("userStatusChanged", { userId, status: "online" });
  });

  // Additional disconnect handler for user status
  const originalDisconnect = socket.listeners("disconnect")[0];
  socket.removeAllListeners("disconnect");
  socket.on("disconnect", () => {
    if (socket.userId) {
      socket.broadcast.emit("userStatusChanged", {
        userId: socket.userId,
        status: "offline",
      });
    }
    // Call original disconnect handler
    if (originalDisconnect) originalDisconnect();
  });
};
