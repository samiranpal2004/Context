import express from 'express';
import {
  createMemory,
  getMemories,
  getMemory,
  updateMemory,
  deleteMemory,
  getMemoryStats
} from '../controllers/memory.controller.js';
import { protectWithApiKey } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require API key
router.use(protectWithApiKey);

// Routes
router.post('/', createMemory);
router.get('/', getMemories);
router.get('/stats', getMemoryStats);  // Must be before /:id
router.get('/:id', getMemory);
router.patch('/:id', updateMemory);
router.delete('/:id', deleteMemory);

export default router;