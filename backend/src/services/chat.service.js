import { generateContent } from './gemini.service.js';
import { semanticSearch } from './search.service.js';

/**
 * Chat with your memories using RAG
 * @param {String} userId - User ID
 * @param {String} question - User's question
 * @param {Number} maxMemories - Max memories to include in context
 * @returns {Object} - Answer and sources
 */
export async function chatWithMemories(userId, question, maxMemories = 5) {
  try {
    console.log('💬 Chat question:', question);
    
    // Step 1: Find relevant memories using semantic search
    console.log('🔍 Searching for relevant memories...');
    const searchResults = await semanticSearch(userId, question, maxMemories);
    
    if (searchResults.length === 0) {
      return {
        answer: "I couldn't find any saved memories related to your question. Try saving some pages first!",
        sources: [],
        memoryCount: 0
      };
    }
    
    console.log(`✅ Found ${searchResults.length} relevant memories`);
    
    // Step 2: Build context from memories
    const memoriesContext = searchResults
      .map((result, index) => {
        const m = result.memory;
        const date = new Date(m.capturedAt).toLocaleDateString();
        
        return `
Memory ${index + 1} (Relevance: ${(result.similarity * 100).toFixed(1)}%):
Title: ${m.title}
URL: ${m.url}
Saved: ${date}
Summary: ${m.summary}
Tags: ${m.tags.join(', ')}
        `.trim();
      })
      .join('\n\n---\n\n');
    
    // Step 3: Create prompt for Gemini
    const prompt = `You are a helpful AI assistant that helps users recall and understand their saved web memories.

USER'S QUESTION:
${question}

RELEVANT SAVED MEMORIES:
${memoriesContext}

INSTRUCTIONS:
- Answer the user's question based ONLY on the saved memories provided above
- Be conversational and natural
- Cite specific memories when relevant (mention the title or date)
- If the memories don't fully answer the question, say so honestly
- If you're synthesizing information from multiple memories, make that clear
- Keep your answer concise but informative (2-4 paragraphs)

YOUR ANSWER:`;

    // Step 4: Generate answer with Gemini
    console.log('🤖 Generating answer with Gemini...');
    const answer = await generateContent(prompt);
    console.log('✅ Answer generated');
    
    // Step 5: Return answer with sources
    return {
      answer: answer.trim(),
      sources: searchResults.map(r => ({
        id: r.memory.id,
        title: r.memory.title,
        url: r.memory.url,
        similarity: r.similarity,
        capturedAt: r.memory.capturedAt
      })),
      memoryCount: searchResults.length
    };
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    throw new Error(`Chat failed: ${error.message}`);
  }
}

/**
 * Generate follow-up questions based on search results
 * @param {String} userId - User ID
 * @param {String} topic - Topic to explore
 * @returns {Array} - Suggested questions
 */
export async function suggestQuestions(userId, topic) {
  try {
    // Find memories about this topic
    const results = await semanticSearch(userId, topic, 5);
    
    if (results.length === 0) {
      return [];
    }
    
    // Build context from memories
    const memoryTitles = results
      .map(r => `- ${r.memory.title}`)
      .join('\n');
    
    const prompt = `Based on these saved web memories:
${memoryTitles}

Generate 3 interesting follow-up questions the user might want to ask about these topics.
Return ONLY a JSON array of strings, no explanations.

Example format:
["Question 1?", "Question 2?", "Question 3?"]`;

    const response = await generateContent(prompt);
    
    // Parse JSON response
    const cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const questions = JSON.parse(cleanResponse);
    
    return Array.isArray(questions) ? questions : [];
    
  } catch (error) {
    console.error('Suggest questions error:', error);
    return [];
  }
}