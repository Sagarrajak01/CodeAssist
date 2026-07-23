const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middlewares/authMiddleware');
const Repository = require('../models/Repository');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8001';

// Fetch Chat History
router.get('/history/:repoId', protect, async (req, res, next) => {
  try {
    const repo = await Repository.findOne({ _id: req.params.repoId, userId: req.user._id });
    if (!repo) return res.status(404).json({ success: false, message: "Repo not found" });
    
    res.status(200).json({ success: true, data: repo.chatHistory || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { repoId, message } = req.body;
    
    if (!repoId || !message) {
      return res.status(400).json({ success: false, message: "repoId and message are required." });
    }
    
    // Request to Python AI 
    const response = await axios.post(`${PYTHON_SERVICE_URL}/api/ai/chat`, {
      repo_id: repoId,
      query: message
    });

    const answer = response.data.answer;

    // Save to MongoDB
    await Repository.findOneAndUpdate(
      { _id: repoId, userId: req.user._id },
      { $push: { chatHistory: [
          { role: 'user', content: message },
          { role: 'ai', content: answer }
      ] } }
    );

    res.status(200).json({
      success: true,
      answer: answer
    });
    
  } catch (error) {
    console.error("[Chat Route] Error calling Python AI Service:", error.message);
    res.status(500).json({ success: false, message: "AI Service failed to respond. Ensure Python server is running." });
  }
});

module.exports = router;