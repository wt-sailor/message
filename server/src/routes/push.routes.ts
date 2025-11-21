import { Router, Request, Response, NextFunction } from 'express';
import * as appService from '../services/appService';
import * as pushService from '../services/pushService';
import { validateSendPush } from '../utils/validation';
import { pushLimiter } from '../middleware/rateLimiter';

const router = Router();

// Send push notification
router.post('/send', pushLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateSendPush(req.body);

    // Validate app credentials
    const app = await appService.validateAppCredentials(data.appId, data.secretKey);

    // Determine target users
    let targetUserIds: string[] | undefined;

    if (data.targets) {
      if (data.targets.externalUserIds && data.targets.externalUserIds.length > 0) {
        targetUserIds = data.targets.externalUserIds;
      }
      // If targets.all is true, targetUserIds remains undefined (send to all)
    }

    // Send push notification
    const result = await pushService.sendPushNotification(
      app.id,
      data.notification,
      targetUserIds
    );

    res.json({
      success: true,
      data: {
        notificationId: result.notificationId,
        sent: result.sent,
        failed: result.failed,
        message: `Notification sent to ${result.sent} device(s), ${result.failed} failed`,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
