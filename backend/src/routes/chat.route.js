import express from 'express';
import { chat, getSuggestions } from '../controllers/chat.controller.js';
import { protectWithApiKey } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require API key
router.use(protectWithApiKey);

// Chat endpoints
router.post('/', chat);
router.post('/suggestions', getSuggestions);

export default router;