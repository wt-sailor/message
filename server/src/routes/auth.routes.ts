import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { validateSignup, validateLogin } from '../utils/validation';
import { authMiddleware } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Signup
router.post('/signup', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateSignup(req.body);
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
    const data = validateLogin(req.body);
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
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

export default router;
