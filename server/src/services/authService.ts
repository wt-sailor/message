import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { config } from '../config/env';
import {
  User,
  UserResponse,
  SignupRequest,
  LoginRequest,
  AuthResponse,
  JwtPayload,
} from '../types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

const SALT_ROUNDS = 10;

const userToResponse = (user: User): UserResponse => {
  const { password_hash, ...userResponse } = user;
  return userResponse;
};

const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
};

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, password_hash, 'ADMIN', 'PENDING']
  );

  const user: User = result.rows[0];
  const token = generateToken(user);

  return {
    token,
    user: userToResponse(user),
  };
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const user: User = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = generateToken(user);

  return {
    token,
    user: userToResponse(user),
  };
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }

  const user: User = result.rows[0];
  return userToResponse(user);
};

export const initializeSuperAdmin = async (): Promise<void> => {
  try {
    // Check if super admin already exists
    const existing = await query(
      'SELECT id FROM users WHERE role = $1',
      ['SUPER_ADMIN']
    );

    if (existing.rows.length > 0) {
      console.log('✅ Super admin already exists');
      return;
    }

    // Create super admin
    const password_hash = await bcrypt.hash(config.superAdmin.password, SALT_ROUNDS);

    await query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        config.superAdmin.name,
        config.superAdmin.email,
        password_hash,
        'SUPER_ADMIN',
        'APPROVED',
      ]
    );

    console.log('✅ Super admin created successfully');
  } catch (error) {
    console.error('❌ Failed to initialize super admin:', error);
    throw error;
  }
};
