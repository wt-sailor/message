import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import * as validation from '../utils/validation';
import { authMiddleware } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const auth = authMiddleware;

// Signup
router.post('/signup', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validation.validateSignup(req.body);
    const result = await authService.signup(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validation.validateLogin(req.body);
    const result = await authService.login(data);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user!.userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.patch('/profile', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updateUserProfile } = require('../services/userService');
    
    const data = validation.validateUpdateProfile(req.body);
    const user = await updateUserProfile(req.user!.userId, data.name, data.email);

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete account
router.delete('/account', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deleteUserAccount } = require('../services/userService');
    
    await deleteUserAccount(req.user!.userId);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.patch('/change-password', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    validation.validateChangePassword(req.body);
    await authService.changePassword(
      req.user!.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
