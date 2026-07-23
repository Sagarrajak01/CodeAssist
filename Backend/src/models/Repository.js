const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    extractedPath: {
      type: String,
      required: true,
    },
    chatHistory: [{
      role: { type: String, enum: ['user', 'ai'] },
      content: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

const Repository = mongoose.model('Repository', repositorySchema);
module.exports = Repository;