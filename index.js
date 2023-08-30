const express = require("express");
const http = require("http"); // Import http module
const io = require("socket.io"); // Import socket.io module
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app); // Create http.Server instance using Express app

// Load environment variables from .env
require("dotenv").config();

// Middleware
app.use(bodyParser.json()); 
app.use(cors()); // Enable CORS

// Serve static files
app.use(express.static(__dirname + "/public"));

// Import and use your routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Socket.IO logic
const socketIO = io(server); // Pass the http.Server instance to socket.io
socketIO.on("connection", (socket) => {
  console.log("Client connected to socket");

  // Emit random messages at intervals
  console.log("Interval started");
  setInterval(() => {
    console.log("Emitting random message...");
    const randomMessage = "Random message: " + Math.random();
    socket.emit("random_message", randomMessage);
  }, 10000);
  
  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected from socket");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
