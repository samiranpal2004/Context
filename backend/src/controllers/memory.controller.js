import Memory from "../models/memory.model.js"
import User from "../models/user.model.js"
import { analyzePageCapture, generateEmbedding } from '../services/gemini.service.js';
import { v4 as uuidv4 } from 'uuid'; 


export const createMemory = async (req, res) => {
  try {
    const { url, title, domain, favicon, pageType, selectedText, customData } = req.body;

    // Validation
    if (!url || !title || !domain) {
      return res.status(400).json({
        success: false,
        message: 'Please provide url, title, and domain'
      });
    }


    // Step 1: Analyze with Gemini
    console.log('🤖 Analyzing page with Gemini...');
    const aiMetadata = await analyzePageCapture({
      title,
      url,
      domain,
      pageType,
      selectedText
    });
    console.log('✅ Analysis complete:', aiMetadata);

    // Step 2: Generate embedding
    let embedding = null;
    try {
      console.log('🔢 Generating embedding...');
      const textToEmbed = `${title} ${aiMetadata.summary} ${aiMetadata.tags.join(' ')}`;
      embedding = await generateEmbedding(textToEmbed);
      console.log('✅ Embedding generated:', embedding.length, 'dimensions');
    } catch (embeddingError) {
      console.error('⚠️  Embedding generation failed:', embeddingError.message);
      console.log('⚠️  Continuing without embedding...');
      // Don't fail the request, just continue without embedding
    }

    // Step 3: Create memory in MongoDB (with embedding)
    const memory = await Memory.create({
      userId: req.user._id,
      url,
      title,
      domain,
      favicon,
      pageType,
      selectedText,
      customData: customData || {},
      summary: aiMetadata.summary,
      intent: aiMetadata.intent,
      tags: aiMetadata.tags,
      importance: aiMetadata.importance,
      embedding: embedding  // ✨ Store embedding in MongoDB
    });

    console.log('✅ Memory saved to MongoDB:', memory._id);

    // Step 4: Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalMemories': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Memory created successfully',
      data: {
        memory: {
          id: memory._id,
          url: memory.url,
          title: memory.title,
          domain: memory.domain,
          summary: memory.summary,
          intent: memory.intent,
          tags: memory.tags,
          importance: memory.importance,
          hasEmbedding: !!embedding,  // Tell client if embedding exists
          capturedAt: memory.capturedAt
        }
      }
    });

  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMemories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId: req.user._id };

    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }
    
    if (req.query.intent) {
      filter.intent = req.query.intent;
    }

    // Get memories
    const memories = await Memory.find(filter)
      .sort({ capturedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Memory.countDocuments(filter);

    res.json({
      success: true,
      data: {
        memories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }

    // Update revisit count
    memory.revisitCount += 1;
    memory.lastAccessedAt = new Date();
    await memory.save();

    res.json({
      success: true,
      data: { memory }
    });

  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateMemory = async (req, res) => {
  try {
    const { userNotes, importance, tags } = req.body;

    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }

    if (userNotes !== undefined) memory.userNotes = userNotes;
    if (importance !== undefined) memory.importance = importance;
    if (tags !== undefined) memory.tags = tags;

    await memory.save();

    res.json({
      success: true,
      message: 'Memory updated successfully',
      data: { memory }
    });

  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalMemories': -1 }
    });

    res.json({
      success: true,
      message: 'Memory deleted successfully'
    });

  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMemoryStats = async (req, res) => {
  try {
    const stats = await Memory.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgImportance: { $avg: '$importance' },
          totalRevisits: { $sum: '$revisitCount' }
        }
      }
    ]);

    const tagStats = await Memory.aggregate([
      { $match: { userId: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const intentStats = await Memory.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, avgImportance: 0, totalRevisits: 0 },
        topTags: tagStats.map(t => ({ tag: t._id, count: t.count })),
        intentDistribution: intentStats.map(i => ({ intent: i._id, count: i.count }))
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};