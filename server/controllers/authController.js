const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../services/memoryStore');
const { isDbConnected } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'isaii_super_secret_jwt_key_9837498273948729', {
    expiresIn: '30d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role === 'seller' ? 'seller' : 'consumer';

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: userRole,
        phone: phone || '',
        address: address || {}
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    } else {
      const userExists = memoryStore.users.find(u => u.email === cleanEmail);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = new mongoose.Types.ObjectId().toString();

      const newUser = {
        _id: newUserId,
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: userRole,
        phone: phone || '',
        address: address || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUserId);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          createdAt: newUser.createdAt
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = memoryStore.users.find(u => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = memoryStore.users.find(u => String(u._id) === String(req.user._id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { password, ...userSafe } = user;
      return res.status(200).json({ success: true, user: userSafe });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address) {
        user.address = {
          street: address.street !== undefined ? address.street : user.address.street,
          city: address.city !== undefined ? address.city : user.address.city,
          state: address.state !== undefined ? address.state : user.address.state,
          pincode: address.pincode !== undefined ? address.pincode : user.address.pincode
        };
      }
      if (password && password.trim().length >= 6) {
        user.password = password;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = memoryStore.users.find(u => String(u._id) === String(req.user._id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address) {
        user.address = {
          street: address.street !== undefined ? address.street : (user.address?.street || ''),
          city: address.city !== undefined ? address.city : (user.address?.city || ''),
          state: address.state !== undefined ? address.state : (user.address?.state || ''),
          pincode: address.pincode !== undefined ? address.pincode : (user.address?.pincode || '')
        };
      }
      if (password && password.trim().length >= 6) {
        user.password = await bcrypt.hash(password, 10);
      }

      user.updatedAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
