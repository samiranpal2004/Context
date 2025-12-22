import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Basic capture data
  url: { type: String, required: true },
  title: { type: String, required: true },
  domain: { type: String, required: true, index: true },
  favicon: String,
  
  // AI-generated metadata
  summary: { type: String, required: true },
  intent: { type: String, required: true },
  tags: [{ type: String, lowercase: true }],
  importance: { type: Number, default: 3, min: 1, max: 5 },
  
  // Rich context
  pageType: String,
  selectedText: String,
  customData: mongoose.Schema.Types.Mixed,
  
  // ✨ VECTOR EMBEDDING (NEW!)
  embedding: {
    type: [Number],
    required: false  // Optional in case embedding fails
  },
  
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
  revisitCount: { type: Number, default: 0 },
  lastAccessedAt: Date,
  userNotes: String,
  capturedAt: { type: Date, default: Date.now }
  
}, { timestamps: true });

// Indexes
memorySchema.index({ userId: 1, capturedAt: -1 });
memorySchema.index({ userId: 1, tags: 1 });
memorySchema.index({ userId: 1, importance: -1 });

const memoryModel = mongoose.model('Memory', memorySchema);

export default memoryModel;