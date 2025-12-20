import mongoose from 'mongoose';

/**
 * User Schema - Just the data structure
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  
  preferences: {
    autoDetectSessions: { type: Boolean, default: true },
    proactiveSuggestions: { type: Boolean, default: true },
    importanceThreshold: { type: Number, default: 3 }
  },
  
  stats: {
    totalMemories: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 }
  }
  
}, { timestamps: true });

const userModel =  mongoose.model('User', userSchema);

export default userModel;