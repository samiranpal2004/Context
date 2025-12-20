import mongoose from 'mongoose';

/**
 * Memory Schema - Just the data structure
 */
const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic capture data
  url: {
    type: String,
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  domain: {
    type: String,
    required: true
  },
  
  favicon: String,
  
  // AI-generated metadata
  summary: {
    type: String,
    required: true
  },
  
  intent: {
    type: String,
    required: true
  },
  
  tags: [String],
  
  importance: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  },
  
  // Optional fields
  pageType: String,
  selectedText: String,
  
  // RAG fields (we'll use later)
  vectorId: String,
  
  // Relationships
  relatedMemories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory'
  }],
  
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchSession'
  },
  
  // Engagement
  revisitCount: {
    type: Number,
    default: 0
  },
  
  lastAccessedAt: Date,
  userNotes: String,
  
  capturedAt: {
    type: Date,
    default: Date.now
  }
  
}, { timestamps: true });

const memoryModel =  mongoose.model('Memory', memorySchema);

export default memoryModel;