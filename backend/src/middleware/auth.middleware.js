import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { connectDB } from '../lib/mongodb.js';

/**
 * Protect routes - Check JWT token
 * Use this for web app routes
 */
export const protect = async (req, res, next) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    let token;

    // Get token from header: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, no token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // User is authenticated, continue to next middleware/controller
    next();
    
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

/**
 * Protect routes - Check API Key
 * Use this for extension routes
 */
export const protectWithApiKey = async (req, res, next) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    // Get API key from header: "x-api-key: ctx_..."
    const apiKey = req.headers['x-api-key'];

    // Check if API key exists
    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'No API key provided' 
      });
    }

    // Find user by API key (exclude password)
    const user = await User.findOne({ apiKey }).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid API key' 
      });
    }

    // Attach user to request
    req.user = user;
    
    // Continue to next middleware/controller
    next();
    
  } catch (error) {
    console.error('API Key auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};
