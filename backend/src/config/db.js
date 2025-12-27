/**
 * DEPRECATED: This file is kept for backward compatibility only
 * Use src/lib/mongodb.js instead for Vercel serverless compatibility
 * 
 * The new implementation provides:
 * - Global connection caching
 * - Disabled buffering (prevents timeouts)
 * - Vercel serverless safe
 */

import { connectDB } from '../lib/mongodb.js';

export { connectDB };