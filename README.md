# Context: Your Selective Memory + Chat Assistant

We all bookmark pages we swear we’ll come back to. Then months pass, and those bookmarks pile up into a cluttered list with vague titles and zero context. This project fixes that. Instead of bookmarking entire pages, you save just the parts you actually care about—snippets, insights, takeaways—and our chatbot answers questions using those saved memories.

Think of it as a personal knowledge base where you’re in control of what goes in, and an AI that speaks from what you saved.

Here is the Live webpage link, You can dawnload the extension from the webpage, In profile section you will get the instructions to use the extension:
https://context-dhch.vercel.app/

---

## Why Not Just Bookmarks?

A standard bookmark:

- Saves the whole page, not your insight.
- Goes stale and gets lost in a long list.
- Doesn’t carry your intent, tags, or context.

What we do differently:

- Save precise snippets (quotes, bullets, code blocks, summaries)—not the entire page.
- Add intent, tags, and optional notes so future-you knows why it mattered.
- Store everything as searchable vectors for fast, meaning-aware retrieval.
- Let the chatbot answer based only on what you chose to keep.

It feels like a personal memory system rather than a bookmark dump.

---

## What Problem We Solve

- Reduce research fatigue: capture only the relevant parts with metadata.
- Make recall effortless: search by meaning, not just exact keywords.
- Keep answers grounded: chatbot responds using your stored context, not random web data.
- Respect privacy and control: nothing is auto-saved; you choose what becomes a memory.

---

## Privacy & Security (Human Terms)

Your context is yours. We do not auto-collect browsing history, and we don’t silently scrape pages.

- No automatic storage: the extension only saves context when you explicitly choose to save.
- Opt-in per item: you decide which snippet, title, tags, and intent to store.
- Clear boundaries: if you don’t save it, it isn’t in the system, and the chatbot cannot see or use it.
- API key ownership: you control API keys and integrations on your device.

See the extension setup and behavior in [extension/SETUP_GUIDE.md](extension/SETUP_GUIDE.md) and troubleshooting in [extension/TROUBLESHOOTING.md](extension/TROUBLESHOOTING.md).

---

## How the Chatbot Uses Your Context (Embeddings + Vectors)

When you ask a question, we run a simple, reliable retrieval flow:

1. Embed the question: we convert your question into a high-dimensional vector (an embedding).
2. Vector search: we find the closest stored memory vectors via similarity (e.g., cosine similarity).
3. Build context: we assemble the top matching memories (your snippets, notes, tags).
4. Generate an answer: the model responds using those retrieved memories—grounded in what you saved.

In short: embeddings turn both your question and saved snippets into vectors; we match by proximity; the chatbot answers from the matches. No saved memory → no exposure → no answer based on that context.

Related code paths you may explore:

- Backend chat flow: [backend/src/services/chat.service.js](backend/src/services/chat.service.js) and [backend/src/controllers/chat.controller.js](backend/src/controllers/chat.controller.js)
- Vector/embedding setup: [backend/src/services/gemini.service.js](backend/src/services/gemini.service.js) and config in [backend/src/config/gemini.js](backend/src/config/gemini.js)
- Memory model and storage: [backend/src/models/memory.model.js](backend/src/models/memory.model.js)
- Search routes: [backend/src/routes/search.route.js](backend/src/routes/search.route.js)

---

## Architecture at a Glance

- Browser Extension (capture):

  - Lets you select text or snippets and save them as “memories”.
  - Adds tags, intent, optional notes.
  - Sends the memory to the backend only when you click save.
  - Files: [extension/manifest.json](extension/manifest.json), [extension/background/service-worker.js](extension/background/service-worker.js), [extension/content/content-script.js](extension/content/content-script.js), [extension/sidepanel/src/App.jsx](extension/sidepanel/src/App.jsx)

- Backend (store + search + chat):

  - Node.js/Express APIs for auth, memory storage, search, and chat.
  - Embedding generation and vector similarity search.
  - Files: [backend/server.js](backend/server.js), [backend/src/app.js](backend/src/app.js), routes in [backend/src/routes](backend/src/routes), services in [backend/src/services](backend/src/services), config in [backend/src/config](backend/src/config)

- Web App (dashboard + chat):
  - Search and browse your memories, visualize intents and tags.
  - Chat interface grounded in your stored context.
  - Files: [web-app/README.md](web-app/README.md), [web-app/pages/Chat.tsx](web-app/pages/Chat.tsx), [web-app/pages/Dashboard.tsx](web-app/pages/Dashboard.tsx)

Workflow details are outlined in [WORKFLOW.md](WORKFLOW.md).

---

## Setup & Run (Windows-friendly)

Prerequisites:

- Node.js 18+ installed
- An API key for your chosen model provider (see [backend/src/config/gemini.js](backend/src/config/gemini.js))

1. Backend

```bash
cd ./backend
npm install
# Create a .env file (see config files for variables like GEMINI_API_KEY)
# Example minimal .env:
# GEMINI_API_KEY=your_key_here
# PORT=8080
# DB_PATH=./data/memories.db
node server.js
```

The server should start and expose routes under a base URL (see [backend/server.js](backend/server.js)).

2. Web App

```bash
cd ./web-app
npm install
npm run dev
```

Open the printed local URL (typically Vite will show it). For backend integration notes, see [web-app/BACKEND_INTEGRATION.md](web-app/BACKEND_INTEGRATION.md).

3. Browser Extension

- See [extension/SETUP_GUIDE.md](extension/SETUP_GUIDE.md) for loading the unpacked extension.
- Configure your backend URL and API key in the sidepanel.

---

## Using the System

- Save a memory:
  - Highlight a snippet in the browser, open the extension, add tags/intent/notes, and click save.
- Search:
  - In the web app, search by keywords or natural language. Results are ranked by vector similarity (meaning, not just exact words).
- Chat:
  - Ask questions in [web-app/pages/Chat.tsx](web-app/pages/Chat.tsx). The bot retrieves your most relevant saved memories and answers based on those. If nothing matches, it will say so rather than inventing context.

---

## API Overview (Quick Map)

- Auth: [backend/src/routes/auth.route.js](backend/src/routes/auth.route.js)
- Memories: [backend/src/routes/memory.route.js](backend/src/routes/memory.route.js)
- Chat: [backend/src/routes/chat.route.js](backend/src/routes/chat.route.js)
- Search: [backend/src/routes/search.route.js](backend/src/routes/search.route.js)

Controllers and middleware live under [backend/src/controllers](backend/src/controllers) and [backend/src/middleware](backend/src/middleware).

---

## Troubleshooting

- Chat returns empty answers:
  - Confirm you’ve saved at least a few memories; no context means no grounding.
- API errors:
  - Ensure the backend is running and the web app points to the correct base URL.
  - Verify your API key in the extension sidepanel and backend `.env`.
- CORS issues:
  - Review server CORS configuration in [backend/src/app.js](backend/src/app.js).

More tips in [extension/TROUBLESHOOTING.md](extension/TROUBLESHOOTING.md).

---

## Roadmap

- Smarter capture: one-click auto-summarization of selected snippets.
- Richer visualizations: intent timelines, tag networks, topic clusters.
- Collaboration: optional shared spaces with strict consent controls.
- Multi-device sync: keep the same memories across devices.

---

## A Human Note

This project came out of the pain of forgetting the good bits. We wanted a way to keep only what matters and have answers later that feel like they’re coming from our own notes—not a black box. If you’ve ever stared at a sea of bookmarks wondering where your actual insight went, this is for you.

Build thoughtfully. Save intentionally. Let the bot speak from your memory.
