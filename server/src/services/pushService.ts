import { query, getClient } from '../config/database';
import {
  Notification,
  NotificationLog,
  NotificationPayload,
  DeviceToken,
  PushSubscription,
} from '../types';
import { webpush } from '../utils/webPush';
import { getDevicesByApp } from './deviceService';

export const sendPushNotification = async (
  appId: number,
  notification: NotificationPayload,
  targetUserIds?: string[]
): Promise<{ notificationId: number; sent: number; failed: number }> => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Create notification record
    const notificationResult = await client.query(
      `INSERT INTO notifications (app_id, payload_json, is_silent)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [appId, JSON.stringify(notification), notification.silent || false]
    );

    const notificationRecord: Notification = notificationResult.rows[0];

    // Get target devices
    const devices = await getDevicesByApp(appId, targetUserIds);

    if (devices.length === 0) {
      await client.query('COMMIT');
      return { notificationId: notificationRecord.id, sent: 0, failed: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send push to each device
    const sendPromises = devices.map(async (device: DeviceToken) => {
      try {
        const subscription: PushSubscription = JSON.parse(device.subscription_json);

        // Prepare payload for web push
        const payload = JSON.stringify(notification);

        // Send push notification
        await webpush.sendNotification(subscription, payload);

        // Log success
        await client.query(
          `INSERT INTO notification_logs (notification_id, device_token_id, status, sent_at)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
          [notificationRecord.id, device.id, 'SENT']
        );

        sentCount++;
      } catch (error: any) {
        // Log failure
        await client.query(
          `INSERT INTO notification_logs (notification_id, device_token_id, status, error_message, sent_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [notificationRecord.id, device.id, 'FAILED', error.message || 'Unknown error']
        );

        failedCount++;

        // If subscription is invalid (410 Gone), mark device as inactive
        if (error.statusCode === 410) {
          await client.query(
            'UPDATE device_tokens SET is_active = false WHERE id = $1',
            [device.id]
          );
        }
      }
    });

    await Promise.all(sendPromises);

    await client.query('COMMIT');

    return {
      notificationId: notificationRecord.id,
      sent: sentCount,
      failed: failedCount,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getNotificationLogs = async (
  notificationId: number
): Promise<NotificationLog[]> => {
  const result = await query(
    'SELECT * FROM notification_logs WHERE notification_id = $1 ORDER BY sent_at DESC',
    [notificationId]
  );

  return result.rows;
};

export const getAppNotifications = async (
  appId: number,
  limit: number = 50
): Promise<Notification[]> => {
  const result = await query(
    'SELECT * FROM notifications WHERE app_id = $1 ORDER BY created_at DESC LIMIT $2',
    [appId, limit]
  );

  return result.rows;
};
