import express from 'express';
import { searchMemories } from '../controllers/search.controller.js';
import { protectWithApiKey } from '../middleware/auth.middleware.js';

const router = express.Router();

// Require API key for all search routes
router.use(protectWithApiKey);

// Semantic search
router.post('/semantic', searchMemories);

export default router;