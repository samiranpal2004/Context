import { chatWithMemories, suggestQuestions } from '../services/chat.service.js';

/**
 * @desc    Chat with memories using RAG
 * @route   POST /api/chat
 * @access  Private (API Key)
 */
export const chat = async (req, res) => {
  try {
    const { question, maxMemories = 5 } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }
    
    console.log(`💬 Chat request from user ${req.user._id}`);
    
    const result = await chatWithMemories(req.user._id, question, maxMemories);
    
    res.json({
      success: true,
      data: {
        question,
        answer: result.answer,
        sources: result.sources,
        memoryCount: result.memoryCount
      }
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get suggested questions
 * @route   POST /api/chat/suggestions
 * @access  Private (API Key)
 */
export const getSuggestions = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic'
      });
    }
    
    const questions = await suggestQuestions(req.user._id, topic);
    
    res.json({
      success: true,
      data: {
        topic,
        suggestions: questions
      }
    });
    
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};