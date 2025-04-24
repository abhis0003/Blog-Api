/* eslint-disable no-undef */
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");

const upload = multer({ storage: multer.memoryStorage() });
const port = 3000;

app.use(express.json());
app.use(upload.any());

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
const uploadRoutes = require ('./routes/uploads')
const postRoutes = require ('./routes/post')
const commentRoutes = require ('./routes/comment')


app.use('/api/comment', commentRoutes)
app.use('/api/post', postRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
// Serve uploaded files statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
database();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
