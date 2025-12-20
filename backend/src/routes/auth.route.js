import express from 'express';
import {
    register,
    login,
    getMe,
    regenerateApiKey,
    verifyApiKey
} from '../controllers/auth.controller.js';
import { protect, protectWithApiKey } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (need JWT token)
router.get('/me', protect, getMe);
router.post('/regenerate-api-key', protect, regenerateApiKey);

// Protected with API key (for extension)
router.get('/verify-api-key', protectWithApiKey, verifyApiKey);

export default router;