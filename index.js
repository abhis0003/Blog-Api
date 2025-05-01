/* eslint-disable no-undef */
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const upload = multer({ storage: multer.memoryStorage() });
const port = 3000;

app.use(express.json());
app.use(upload.any());

const io = new Server(httpServer, {
  /* options */
});
const users = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log("A user connected");

  // User registers themselves
  socket.on("register", ({id}) => {
    users.set(id, socket.id);
    console.log(`${id} registered with socket ID ${socket.id}`);
  });

  // Handle private message
  socket.on("message", ({ id, message }) => {
    const targetSocketId = users.get(id);
    if (targetSocketId) {
      io.to(targetSocketId).emit("message", {
        from: socket.id,
        message,
      });
    } else {
      socket.emit("error", `User ${id} is not online.`);
    }
  });

  socket.on("disconnect", () => {
    // Optionally remove the user from the map
    for (const [user, id] of users.entries()) {
      if (id === socket.id) {
        users.delete(user);
        console.log(`${user} disconnected`);
        break;
      }
    }
  });
});

const dbConnect = require("../hashing-jwt-auth/config/db");

// Connect to database
const database = async () => {
  try {
    await dbConnect();
    console.log("connected");
  } catch (error) {
    console.log("connection failed:", error);
  }
};

// Mount routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const uploadRoutes = require("./routes/uploads");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const requestRoutes = require("./routes/friend-request");

app.use("/api/request", requestRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
// Serve uploaded files statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
database();
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
