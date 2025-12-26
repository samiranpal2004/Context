# Project Workflow

## Overview 💡
This document describes, in simple steps, how the extension and backend work together when users do two main things:
- Press the save shortcut (Ctrl+Shift+S) to save a page as a "memory"
- Ask a question in the chat sidepanel

Keep it short and simple: capture → analyze → save → search → answer.

---

## 1) Save page: Press Ctrl+Shift+S 🔖
1. User presses **Ctrl+Shift+S** in the browser.
2. The browser sends the command to the extension background script (`extension/background/service-worker.js`).
3. The background script checks the user's API key (stored in the extension storage) and finds the active tab.
4. The background script asks the content script (`extension/content/content-script.js`) to capture the page data (URL, title, selected text, favicon, etc.).
5. The background script sends the captured data to the backend as a POST request to `/api/memories` (on `backend`). The API key is included in headers.
6. Backend validates the input and calls the AI service (`backend/src/services/gemini.service.js`) to analyze the page and produce a short summary, tags, and intent.
7. Backend optionally generates embeddings for semantic search and stores the memory in the database (`backend/src/models/memory.model.js`).
8. The extension shows a success notification (or an error if anything failed).

Notes:
- If the API key is missing, the extension asks the user to set it in the popup.
- If embeddings or the AI service fail, the memory is still saved (without embeddings) so the user doesn't lose data.

---

## 2) Chat flow: Ask a question in the sidepanel 💬
1. User types a question in the sidepanel chat UI (`extension/sidepanel/src/components/Chat/*`) and hits send.
2. The sidepanel sends the question to the backend: POST `/api/chat` with `{ question, maxMemories }` and `x-api-key` header.
3. The backend's chat controller (`backend/src/controllers/chat.controller.js`) receives the request and calls the chat service (`backend/src/services/chat.service.js`).
4. The chat service fetches the most relevant memories using semantic search (`backend/src/services/search.service.js`). It uses embeddings to find similar memories.
5. The backend builds a prompt that includes the user's question plus the selected memories as context, and asks the AI (`gemini.service`) to answer using only those memories.
6. The AI returns a response. The backend adds source details (which memories were used) and returns `{ answer, sources }` to the sidepanel.
7. The sidepanel displays the answer and shows links or titles of the source memories.

Notes:
- This flow is RAG (retrieval-augmented generation): retrieval (search) + generation (AI answer).

---

## Key files & responsibilities 🔧
- Extension (frontend):
  - `extension/background/service-worker.js` — listens to keyboard shortcuts and handles save flow.
  - `extension/content/content-script.js` — captures page content and metadata.
  - `extension/sidepanel/src/components/Chat/*` — chat UI and sending chat requests.
  - `extension/popup/*` — API key and settings UI.

- Backend (server):
  - `backend/src/controllers/memory.controller.js` — handles `/api/memories` (save/retrieve memories).
  - `backend/src/controllers/chat.controller.js` — handles `/api/chat` (chat requests).
  - `backend/src/services/gemini.service.js` — wraps calls to the AI model (analyze pages, generate answers, embeddings).
  - `backend/src/services/search.service.js` — vector/semantic search for memories.
  - `backend/src/services/chat.service.js` — builds prompts for chat using retrieved memories.
  - `backend/src/models/memory.model.js` — memory schema and DB storage.

---

## Simple diagrams ✨
- Save flow: Browser shortcut → Background → Content script → POST `/api/memories` → Backend (AI analysis + store) → Notification
- Chat flow: Sidepanel → POST `/api/chat` → Backend (semantic search) → AI (context + question) → Answer + sources → UI

---

## Troubleshooting & tips ⚠️
- Missing API key: user sees a message in the popup to enter it.
- Content script cannot run on some pages (browser pages like `chrome://`); the extension shows an error.
- AI service errors: backend returns a clear error; often retrying or saving without embeddings works.
- If search seems inaccurate: make sure embeddings were generated for memories and the backend has not lost them.

---

If you want, I can:
- Add this file to the repo root now (I already created it here), or
- Make a short README section linking to `WORKFLOW.md`, or
- Convert this into a flowchart image.

Let me know which you prefer. ✅