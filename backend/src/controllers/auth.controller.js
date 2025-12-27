import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import { connectDB } from '../lib/mongodb.js';


const generateToken = (id) => {
  return jwt.sign(
    { id },  // Payload - data stored in token
    process.env.JWT_SECRET,  // Secret key
    { expiresIn: process.env.JWT_EXPIRE }  // Expiration time
  );
};


export const register = async (req, res) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    const { name, email, password } = req.body;

    // 1. Validation - Check if all fields provided
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and password' 
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate API key for extension
    const apiKey = `ctx_${crypto.randomBytes(32).toString('hex')}`;

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      apiKey
    });

    // 6. Generate JWT token
    const token = generateToken(user._id);

    // 7. Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          apiKey: user.apiKey
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const login = async (req, res) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // 2. Find user by email (include password this time)
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // 3. Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Return response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          apiKey: user.apiKey
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          apiKey: user.apiKey,
          preferences: user.preferences,
          stats: user.stats,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const regenerateApiKey = async (req, res) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Generate new API key
    user.apiKey = `ctx_${crypto.randomBytes(32).toString('hex')}`;
    await user.save();

    res.json({
      success: true,
      message: 'API key regenerated successfully',
      data: {
        apiKey: user.apiKey
      }
    });
    
  } catch (error) {
    console.error('Regenerate API key error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const verifyApiKey = async (req, res) => {
  try {
    // Ensure DB connection
    await connectDB();
    
    // req.user is set by protectWithApiKey middleware
    res.json({
      success: true,
      message: 'API key is valid',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
    
  } catch (error) {
    console.error('Verify API key error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};