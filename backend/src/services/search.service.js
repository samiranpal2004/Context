import Memory from '../models/memory.model.js';
import { generateEmbedding } from './gemini.service.js';

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} vecA - First vector
 * @param {Array} vecB - Second vector
 * @returns {Number} - Similarity score (0 to 1)
 */
function cosineSimilarity(vecA, vecB) {
  // Dot product
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  // Cosine similarity
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return similarity;
}

/**
 * Semantic search - Find similar memories
 * @param {String} userId - User ID
 * @param {String} query - Search query
 * @param {Number} limit - Max results
 * @returns {Array} - Similar memories
 */
export async function semanticSearch(userId, query, limit = 10) {
  try {
    console.log('🔍 Semantic search for:', query);
    
    // Step 1: Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);
    console.log('✅ Query embedding generated');
    
    // Step 2: Get all user's memories that have embeddings
    const memories = await Memory.find({
      userId,
      embedding: { $exists: true, $ne: null }
    }).select('+embedding');  // Include embedding field
    
    console.log(`📊 Found ${memories.length} memories with embeddings`);
    
    if (memories.length === 0) {
      return [];
    }
    
    // Step 3: Calculate similarity for each memory
    const results = memories.map(memory => {
      const similarity = cosineSimilarity(queryEmbedding, memory.embedding);
      
      return {
        memory: {
          id: memory._id,
          title: memory.title,
          url: memory.url,
          summary: memory.summary,
          intent: memory.intent,
          tags: memory.tags,
          importance: memory.importance,
          capturedAt: memory.capturedAt
        },
        similarity: similarity
      };
    });
    
    // Step 4: Sort by similarity (highest first)
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Step 5: Return top results
    const topResults = results.slice(0, limit);
    
    console.log(`✅ Returning ${topResults.length} results`);
    console.log('Top similarity:', topResults[0]?.similarity);
    
    return topResults;
    
  } catch (error) {
    console.error('❌ Semantic search error:', error);
    throw error;
  }
}
