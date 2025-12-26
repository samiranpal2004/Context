import { genAI, MODELS } from "../config/gemini.js";

export async function analyzePageCapture(pageData) {
  const { title, url, domain, pageType, selectedText } = pageData;

  // Build context string for Gemini
  const context = `
Title: ${title}
URL: ${url}
Domain: ${domain}
Page Type: ${pageType || "webpage"}
${selectedText ? `Selected Text: ${selectedText}` : ""}
  `.trim();

  // Create the prompt
  const prompt = `Analyze this web page capture and provide structured metadata in JSON format ONLY (no markdown, no explanations):

${context}

Return ONLY a valid JSON object with these fields:
- summary: A 1-2 sentence description of what the user was doing (max 150 words)
- intent: The user's likely goal (choose ONE: learning, research, shopping, entertainment, work, reference, comparison, other)
- tags: Array of 3-5 relevant topic keywords (lowercase, no spaces)
- importance: A score from 1-5 indicating how valuable this might be for future reference (5 = highly valuable)

Example format:
{
  "summary": "User was learning about React hooks",
  "intent": "learning",
  "tags": ["react", "hooks", "javascript"],
  "importance": 4
}`;

  try {
    console.log("🤖 Calling Gemini API for page analysis...");

    // Call Gemini to generate content
    const response = await generateContent(prompt);

    // Parse the response into structured data
    const metadata = parseMetadataResponse(response);

    console.log("✅ Page analysis complete:", metadata);
    return metadata;
  } catch (error) {
    console.error("❌ Gemini analysis error:", error.message);

    // If AI fails, use fallback values
    return getFallbackMetadata(pageData);
  }
}

export async function generateContent(prompt) {
  try {
    const response = await genAI.models.generateContent({
      model: MODELS.FLASH,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("❌ Gemini generation error:", error);
    throw new Error(`Gemini generation failed: ${error.message}`);
  }
}

export async function generateEmbedding(text) {
  try {
    console.log(
      "Attempting to generate embedding for text length:",
      text.length
    );

    if (genAI.models && typeof genAI.models.embedContent === "function") {
      const result = await genAI.models.embedContent({
        model: MODELS.EMBEDDING,
        contents: text,
      });

      // FIX: Extract the values from the first embedding
      const embedding = result.embeddings[0].values;

      console.log("✅ Embedding generated:", embedding.length, "dimensions");
      return embedding;
    }
  } catch (error) {
    console.error("❌ Embedding generation error:", error);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
}

function parseMetadataResponse(response) {
  try {
    // Remove markdown code blocks if Gemini included them
    const cleanResponse = response
      .replace(/```json\n?/g, "") // Remove ```json
      .replace(/```\n?/g, "") // Remove ```
      .trim();

    // Parse JSON
    const metadata = JSON.parse(cleanResponse);

    // Validate that all required fields exist
    if (
      !metadata.summary ||
      !metadata.intent ||
      !metadata.tags ||
      !metadata.importance
    ) {
      throw new Error("Missing required fields in Gemini response");
    }

    // Validate intent is one of the allowed values
    const validIntents = [
      "learning",
      "research",
      "shopping",
      "entertainment",
      "work",
      "reference",
      "comparison",
      "other",
    ];

    if (!validIntents.includes(metadata.intent)) {
      console.log(
        `⚠️  Invalid intent "${metadata.intent}", defaulting to "other"`
      );
      metadata.intent = "other";
    }

    // Ensure importance is between 1-5
    metadata.importance = Math.max(1, Math.min(5, metadata.importance));

    // Ensure tags is an array
    if (!Array.isArray(metadata.tags)) {
      metadata.tags = [metadata.tags];
    }

    // Clean up tags (lowercase, remove spaces)
    metadata.tags = metadata.tags.map((tag) =>
      String(tag).toLowerCase().replace(/\s+/g, "-")
    );

    return metadata;
  } catch (error) {
    console.error("❌ Failed to parse Gemini response:", error.message);
    throw new Error(`Failed to parse metadata: ${error.message}`);
  }
}

function getFallbackMetadata(pageData) {
  console.log("⚠️  Using fallback metadata (AI failed)");

  return {
    summary: pageData.title || "Saved web page",
    intent: "other",
    tags: [pageData.domain.replace(/\./g, "-")],
    importance: 3,
  };
}

export async function generateChatResponse(question, memories) {
  // Build context from memories
  const contextText = memories
    .map((memory) => {
      const date = new Date(memory.capturedAt).toLocaleDateString();
      return `[${date}] ${memory.title}: ${memory.summary}`;
    })
    .join("\n\n");

  // Create prompt
  const prompt = `You are a helpful assistant that helps users recall their saved web memories.

User's Question: ${question}

Relevant saved memories:
${contextText}

Instructions:
- Provide a helpful answer based on the user's saved memories
- Be conversational and friendly
- Cite specific memories when relevant (mention the date and title)
- If the memories don't contain the answer, say so politely

Your response:`;

  try {
    const response = await generateContent(prompt);
    return response;
  } catch (error) {
    console.error("❌ Chat response generation failed:", error);
    return "I'm sorry, I couldn't generate a response at this time. Please try again.";
  }
}
