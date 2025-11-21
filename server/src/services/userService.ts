import { query } from '../config/database';
import {
  User,
  UserResponse,
  UserStatus,
  UpdateUserStatusRequest,
  UpdateAppLimitRequest,
  CreateWarningRequest,
  Warning,
} from '../types';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const userToResponse = (user: User): UserResponse => {
  const { password_hash, ...userResponse } = user;
  return userResponse;
};

export const getAllUsers = async (statusFilter?: UserStatus): Promise<UserResponse[]> => {
  let queryText = 'SELECT * FROM users WHERE role = $1';
  const params: any[] = ['ADMIN'];

  if (statusFilter) {
    queryText += ' AND status = $2';
    params.push(statusFilter);
  }

  queryText += ' ORDER BY created_at DESC';

  const result = await query(queryText, params);
  return result.rows.map(userToResponse);
};

export const updateUserStatus = async (
  userId: number,
  data: UpdateUserStatusRequest
): Promise<UserResponse> => {
  const result = await query(
    `UPDATE users 
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND role = $3
     RETURNING *`,
    [data.status, userId, 'ADMIN']
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found or cannot modify super admin');
  }

  return userToResponse(result.rows[0]);
};

export const updateUserAppLimit = async (
  userId: number,
  data: UpdateAppLimitRequest
): Promise<UserResponse> => {
  const result = await query(
    `UPDATE users 
     SET app_limit = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND role = $3
     RETURNING *`,
    [data.appLimit, userId, 'ADMIN']
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found or cannot modify super admin');
  }

  return userToResponse(result.rows[0]);
};

export const createWarning = async (
  userId: number,
  createdBy: number,
  data: CreateWarningRequest
): Promise<Warning> => {
  // Verify user exists
  const userCheck = await query(
    'SELECT id FROM users WHERE id = $1',
    [userId]
  );

  if (userCheck.rows.length === 0) {
    throw new NotFoundError('User not found');
  }

  const result = await query(
    `INSERT INTO warnings (user_id, message, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, data.message, createdBy]
  );

  return result.rows[0];
};

export const getUserWarnings = async (userId: number): Promise<Warning[]> => {
  const result = await query(
    'SELECT * FROM warnings WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  return result.rows;
};
