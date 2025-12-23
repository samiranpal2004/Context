# Context Browser Extension - Sidepanel Implementation

## Project Context
I'm building a browser extension called "Context" that saves web pages with AI analysis and allows users to chat with their saved memories using RAG (Retrieval-Augmented Generation). The backend API is already complete and running on `http://localhost:5000`.

## Backend API Integration

### Available Endpoints:

#### 1. Get All Memories
```
GET http://localhost:5000/api/memories
Headers: x-api-key: {apiKey}

Response:
{
  "success": true,
  "data": {
    "memories": [
      {
        "_id": "65abc...",
        "title": "Page Title",
        "url": "https://...",
        "summary": "AI-generated summary",
        "intent": "learning",
        "tags": ["tag1", "tag2"],
        "importance": 4,
        "capturedAt": "2024-01-20T..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "pages": 1
    }
  }
}
```

#### 2. Semantic Search
```
POST http://localhost:5000/api/search/semantic
Headers: 
  Content-Type: application/json
  x-api-key: {apiKey}
Body: {
  "query": "search query here",
  "limit": 10
}

Response:
{
  "success": true,
  "data": {
    "query": "search query",
    "results": [
      {
        "memory": { ...memory object... },
        "similarity": 0.85
      }
    ],
    "count": 5
  }
}
```

#### 3. RAG Chat
```
POST http://localhost:5000/api/chat
Headers:
  Content-Type: application/json
  x-api-key: {apiKey}
Body: {
  "question": "What did I learn about React?",
  "maxMemories": 5
}

Response:
{
  "success": true,
  "data": {
    "question": "...",
    "answer": "Based on your saved memories...",
    "sources": [
      {
        "id": "...",
        "title": "...",
        "url": "...",
        "similarity": 0.87,
        "capturedAt": "..."
      }
    ],
    "memoryCount": 3
  }
}
```

#### 4. Get Memory Statistics
```
GET http://localhost:5000/api/memories/stats
Headers: x-api-key: {apiKey}

Response:
{
  "success": true,
  "data": {
    "overview": {
      "total": 25,
      "avgImportance": 3.8,
      "totalRevisits": 15
    },
    "topTags": [
      { "tag": "react", "count": 10 },
      { "tag": "javascript", "count": 8 }
    ],
    "intentDistribution": [
      { "intent": "learning", "count": 15 },
      { "intent": "research", "count": 10 }
    ]
  }
}
```

### API Key Storage
The API key is stored in Chrome storage:
```javascript
chrome.storage.local.get('apiKey', (result) => {
  const apiKey = result.apiKey;
});
```

## Requirements

### Tech Stack
- React 18 with Hooks
- Vite as build tool
- Tailwind CSS for styling
- Chrome Extension APIs (chrome.storage, chrome.runtime)
- Fetch API for backend communication

### App Structure
Create the following component structure in `src/`:
```
src/
├── App.jsx                    # Main app container with routing
├── main.jsx                   # Entry point
├── index.css                  # Tailwind imports
├── api/
│   └── backend.js            # API client for backend communication
├── hooks/
│   ├── useApiKey.js          # Hook to get API key from Chrome storage
│   └── useMemories.js        # Hook to fetch and manage memories
├── components/
│   ├── Layout.jsx            # Main layout with navigation
│   ├── Chat/
│   │   ├── ChatInterface.jsx      # Main chat component
│   │   ├── ChatMessage.jsx        # Individual message bubble
│   │   ├── ChatInput.jsx          # Message input with send button
│   │   └── SourceCard.jsx         # Display source memories
│   ├── Memories/
│   │   ├── MemoryList.jsx         # List of all memories
│   │   ├── MemoryCard.jsx         # Individual memory card
│   │   ├── MemoryFilters.jsx      # Filter by tags, intent, date
│   │   └── MemorySearch.jsx       # Search bar component
│   ├── Dashboard/
│   │   ├── StatsOverview.jsx      # Statistics cards
│   │   ├── TagCloud.jsx           # Visual tag cloud
│   │   └── IntentChart.jsx        # Intent distribution chart
│   └── Common/
│       ├── LoadingSpinner.jsx     # Loading state
│       ├── EmptyState.jsx         # When no data
│       └── ErrorMessage.jsx       # Error display
└── utils/
    ├── dateFormatter.js      # Format dates nicely
    └── intentColors.js       # Color mapping for intents
```

## Design Requirements

### Overall Design Philosophy
- **Modern & Classy**: Clean lines, subtle shadows, smooth animations
- **Premium Feel**: Thoughtful spacing, elegant typography, polished interactions
- **Color Scheme**: 
  - Primary: Indigo/Purple gradient (`from-indigo-500 to-purple-600`)
  - Background: Light gray (`bg-gray-50`)
  - Cards: White with subtle shadow
  - Text: Dark gray for body (`text-gray-700`), near-black for headings
- **Typography**: 
  - Headings: `font-semibold` or `font-bold`
  - Body: `font-normal`
  - Use varying sizes for hierarchy

### Tailwind Design Patterns

#### Card Style (use for memories, messages, stats):
```jsx

```

#### Button Styles:
```jsx
// Primary


// Secondary


// Icon button

```

#### Input Style:
```jsx

```

#### Badge/Tag Style:
```jsx

```

### Layout Structure

#### Navigation (Top or Side Tabs):
- Dashboard (📊) - Stats overview
- Chat (💬) - RAG chat interface
- Memories (📚) - Browse all saved pages
- Search (🔍) - Semantic search

Use icon + text for clarity.

### Component-Specific Requirements

#### 1. ChatInterface Component
**Features:**
- Message list with auto-scroll to bottom
- User messages: Right-aligned, indigo background
- AI messages: Left-aligned, gray background
- Show "thinking..." animation when loading
- Display source cards below AI responses (collapsible)
- Suggested questions as clickable chips
- Empty state: "Ask me anything about your saved memories!"

**Source Cards Display:**
- Show title, URL (truncated), similarity score
- Click to open URL in new tab
- Display as compact cards below message
- Use `text-xs` for metadata

#### 2. MemoryList Component
**Features:**
- Grid or list view toggle
- Each card shows:
  - Title (bold, clickable)
  - Summary (2 lines max, `line-clamp-2`)
  - Tags as badges
  - Importance as stars (★★★★☆)
  - Date (relative: "2 days ago")
  - Intent badge with icon
- Filter chips at top (All, Learning, Research, Shopping, etc.)
- Search bar with instant filter
- Pagination or infinite scroll
- Empty state: "No memories yet. Press Ctrl+Shift+S to save a page!"

#### 3. Dashboard Component
**Features:**
- Stats cards row:
  - Total Memories (with icon 📚)
  - Average Importance (with stars ⭐)
  - Most Used Tags (top 3)
  - Recent Activity (count this week)
- Tag cloud (larger text for popular tags)
- Intent distribution chart or bars
- Recent memories list (last 5)
- Use gradient backgrounds for stat cards

#### 4. Search Component
**Features:**
- Large search input at top
- "Try: 'React tutorials' or 'authentication methods'"
- Results as cards with similarity score
- Highlight matching tags
- Filter by similarity threshold slider
- Empty results state: "No matching memories found"

### Animations & Interactions
- Fade in on load
- Smooth hover states (use `transition-all duration-200`)
- Loading spinners using Tailwind animate-spin
- Message typing animation dots
- Smooth scroll behavior
- Skeleton loaders while fetching data

### Responsive Design
- Fixed height: `h-[600px]` (sidepanel standard)
- Scrollable content areas: `overflow-y-auto`
- Sticky navigation/header
- Mobile-friendly (even though it's an extension)

## Implementation Guidelines

### 1. API Client (api/backend.js)
Create a centralized API client that:
- Gets API key from Chrome storage
- Handles all fetch requests
- Includes error handling
- Returns parsed JSON
```javascript
async function apiCall(endpoint, options = {}) {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  // ... implement fetch with proper headers
}
```

### 2. State Management
Use React hooks:
- `useState` for local state
- `useEffect` for data fetching
- Custom hooks for reusable logic (useApiKey, useMemories)
- No Redux needed for this scope

### 3. Error Handling
- Show friendly error messages
- Retry button on failures
- Handle "no API key" state gracefully
- Toast notifications for actions (optional)

### 4. Performance
- Lazy load components if needed
- Debounce search input
- Memoize expensive calculations
- Limit memory list rendering (virtual scroll if many items)

### 5. Accessibility
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals/inputs

## Example Component Patterns

### Memory Card Example:
```jsx

  
    
      {title}
    
    
      {formatDate(capturedAt)}
    
  
  
  
    {summary}
  
  
  
    
      {tags.map(tag => (
        
          {tag}
        
      ))}
    
    
    
      {'★'.repeat(importance)}{'☆'.repeat(5-importance)}
    
  

```

### Chat Message Example:
```jsx
// User message

  
    {message}
  


// AI message

  
    {message}
    {sources && (
      
        Sources:
        {/* Source cards here */}
      
    )}
  

```

## Success Criteria

The sidepanel should:
✅ Load API key from Chrome storage on mount
✅ Display all memories in a beautiful, filterable list
✅ Allow semantic search with live results
✅ Enable RAG chat with message history
✅ Show source citations for AI responses
✅ Display statistics dashboard
✅ Have smooth animations and transitions
✅ Handle loading and error states gracefully
✅ Look modern, premium, and polished
✅ Be fully responsive within 600px height
✅ Work seamlessly with the backend API

## Additional Notes

- Use `chrome.storage.local` for persisting chat history (optional)
- Add keyboard shortcuts (Enter to send, Cmd+K for search)
- Consider adding export functionality (memories as JSON/CSV)
- Add "Delete memory" functionality if time permits
- Use optimistic UI updates where appropriate
- Test with both empty state and populated data

Now implement this complete sidepanel application following these specifications. Focus on creating a delightful user experience with smooth interactions, beautiful design, and robust functionality.