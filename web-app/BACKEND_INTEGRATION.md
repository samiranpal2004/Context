# Backend Integration Setup

## ✅ Configuration Complete

The web app is now fully configured to connect to the backend API.

### What was configured:

1. **Environment Variables** (`.env`)

   - `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)
   - `VITE_GEMINI_API_KEY` - Optional Gemini API key for client-side features

2. **API Service** (`services/apiService.ts`)

   - Real HTTP calls to backend endpoints
   - JWT token authentication
   - API key authentication for extension features
   - Error handling and response parsing
   - Complete CRUD operations for memories
   - Auth operations (login, register, profile)
   - Chat and search functionality

3. **Auth Context** (`contexts/AuthContext.tsx`)
   - Integrated with real login/register endpoints
   - Automatic token and API key management
   - User profile fetching from backend

## 🚀 Usage

### Before Running:

1. **Backend Setup:**

   ```bash
   cd backend
   # Create .env file (copy from .env.example)
   npm install
   npm run dev
   ```

2. **Web App Setup:**
   ```bash
   cd web-app
   # .env file already created
   npm run dev
   ```

### API Endpoints Available:

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/regenerate-api-key` - Regenerate API key

#### Memories

- `GET /api/memories` - Get all memories (with filters)
- `GET /api/memories/:id` - Get single memory
- `POST /api/memories` - Create new memory
- `PATCH /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `GET /api/memories/stats` - Get memory statistics

#### Chat

- `POST /api/chat` - Send chat message
- `POST /api/chat/suggestions` - Get query suggestions

#### Search

- `POST /api/search/semantic` - Semantic search across memories

## 🔐 Authentication

The app supports two authentication methods:

1. **JWT Token** - For web app authentication (stored in localStorage as `ctx_token`)
2. **API Key** - For extension and programmatic access (stored in localStorage as `ctx_api_key`)

Both are automatically managed by the `apiService`.

## 🛠️ Environment Configuration

### Development

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## ⚠️ Important Notes

- Backend must be running on port 5000 (or update `VITE_API_BASE_URL`)
- CORS is configured in backend to allow `http://localhost:3000`
- Tokens are persisted in localStorage for session management
- All API calls include proper error handling

## 🔍 Troubleshooting

### "Failed to fetch" errors

- Ensure backend is running: `cd backend && npm run dev`
- Check backend console for errors
- Verify MongoDB is running

### CORS errors

- Check `ALLOWED_ORIGINS` in backend `.env`
- Default allows `http://localhost:3000`

### Authentication errors

- Clear localStorage: `localStorage.clear()` in browser console
- Re-login to get fresh tokens
