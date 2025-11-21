import { Router, Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import {
  validateUpdateUserStatus,
  validateUpdateAppLimit,
  validateCreateWarning,
} from '../utils/validation';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';
import { UserStatus } from '../types';

const router = Router();

// All routes require super admin
router.use(authMiddleware);
router.use(requireRole('SUPER_ADMIN'));

// Get all users
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusFilter = req.query.status as UserStatus | undefined;
    const users = await userService.getAllUsers(statusFilter);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// Update user status
router.patch('/users/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const data = validateUpdateUserStatus(req.body);
    const user = await userService.updateUserStatus(userId, data);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update user app limit
router.patch('/users/:id/app-limit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const data = validateUpdateAppLimit(req.body);
    const user = await userService.updateUserAppLimit(userId, data);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Create warning for user
router.post('/users/:id/warn', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const data = validateCreateWarning(req.body);
    const warning = await userService.createWarning(userId, req.user!.userId, data);

    res.status(201).json({
      success: true,
      data: warning,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
