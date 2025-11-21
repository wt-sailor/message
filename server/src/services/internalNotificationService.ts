import { query } from '../config/database';
import { sendPushNotification } from './pushService';

// Internal app ID for admin panel notifications
// This will be created during initialization
const INTERNAL_APP_NAME = 'Admin Panel Notifications';

/**
 * Get or create the internal app for admin panel notifications
 */
export const getOrCreateInternalApp = async (): Promise<{ id: number; public_app_id: string }> => {
  // Check if internal app exists
  const existingApp = await query(
    'SELECT id, public_app_id FROM apps WHERE name = $1 AND description = $2',
    [INTERNAL_APP_NAME, 'Internal app for admin panel notifications']
  );

  if (existingApp.rows.length > 0) {
    return existingApp.rows[0];
  }

  // Create internal app (assign to first super admin)
  const superAdmin = await query(
    'SELECT id FROM users WHERE role = $1 LIMIT 1',
    ['SUPER_ADMIN']
  );

  if (superAdmin.rows.length === 0) {
    throw new Error('No super admin found to create internal app');
  }

  const { generateAppId, generateSecretKey } = require('../utils/crypto');
  const publicAppId = generateAppId();
  const secretKey = generateSecretKey();

  const newApp = await query(
    `INSERT INTO apps (user_id, name, description, public_app_id, secret_key, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING id, public_app_id`,
    [
      superAdmin.rows[0].id,
      INTERNAL_APP_NAME,
      'Internal app for admin panel notifications',
      publicAppId,
      secretKey,
    ]
  );

  return newApp.rows[0];
};

/**
 * Send notification to super admins
 */
export const notifySuperAdmins = async (title: string, body: string, data?: any): Promise<void> => {
  try {
    const internalApp = await getOrCreateInternalApp();

    // Get all super admin user IDs
    const superAdmins = await query(
      'SELECT id FROM users WHERE role = $1',
      ['SUPER_ADMIN']
    );

    if (superAdmins.rows.length === 0) {
      return;
    }

    const externalUserIds = superAdmins.rows.map((admin) => `admin_${admin.id}`);

    await sendPushNotification(
      internalApp.id,
      {
        title,
        body,
        icon: '/admin-icon.png',
        data,
      },
      { externalUserIds }
    );
  } catch (error) {
    console.error('Failed to notify super admins:', error);
    // Don't throw - internal notifications shouldn't break the main flow
  }
};

/**
 * Send notification to a specific user
 */
export const notifyUser = async (
  userId: number,
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    const internalApp = await getOrCreateInternalApp();

    await sendPushNotification(
      internalApp.id,
      {
        title,
        body,
        icon: '/admin-icon.png',
        data,
      },
      { externalUserIds: [`admin_${userId}`] }
    );
  } catch (error) {
    console.error(`Failed to notify user ${userId}:`, error);
    // Don't throw - internal notifications shouldn't break the main flow
  }
};

/**
 * Notify super admin when new user signs up
 */
export const notifySuperAdminNewUser = async (userName: string, userEmail: string): Promise<void> => {
  await notifySuperAdmins(
    'New User Signup',
    `${userName} (${userEmail}) has signed up and is awaiting approval`,
    { type: 'new_user', email: userEmail }
  );
};

/**
 * Notify user when their account is approved
 */
export const notifyUserApproved = async (userId: number, userName: string): Promise<void> => {
  await notifyUser(
    userId,
    'Account Approved! 🎉',
    `Welcome ${userName}! Your account has been approved. You can now create apps.`,
    { type: 'account_approved' }
  );
};

/**
 * Notify user when their account is banned
 */
export const notifyUserBanned = async (userId: number): Promise<void> => {
  await notifyUser(
    userId,
    'Account Suspended',
    'Your account has been suspended. Please contact the administrator.',
    { type: 'account_banned' }
  );
};

/**
 * Notify user when they receive a warning
 */
export const notifyUserWarned = async (userId: number, message: string): Promise<void> => {
  await notifyUser(
    userId,
    'Warning from Administrator',
    message,
    { type: 'warning' }
  );
};

/**
 * Notify user when their app limit changes
 */
export const notifyUserAppLimitChanged = async (
  userId: number,
  newLimit: number | null
): Promise<void> => {
  const limitText = newLimit === null ? 'unlimited' : newLimit.toString();
  await notifyUser(
    userId,
    'App Limit Updated',
    `Your app creation limit has been updated to: ${limitText}`,
    { type: 'app_limit_changed', newLimit }
  );
};
