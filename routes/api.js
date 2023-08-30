const express = require("express");
const router = express.Router();
const Messages = require("../models/messages"); 
// Get all messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await Messages.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new message
router.post("/messages", async (req, res) => {
  try {
    const { name, origin, destination } = req.body;
    const newMessage = new Messages({ name, origin, destination });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
