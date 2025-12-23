import { semanticSearch } from '../services/search.service.js';

/**
 * @desc    Semantic search memories
 * @route   POST /api/search/semantic
 * @access  Private (API Key)
 */
export const searchMemories = async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    const results = await semanticSearch(req.user._id, query, limit);
    
    res.json({
      success: true,
      data: {
        query,
        results,
        count: results.length
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};