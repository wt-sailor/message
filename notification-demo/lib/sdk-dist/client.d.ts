import { InitOptions, RegisterDeviceOptions } from './types';
export declare class NotificationClient {
    private baseUrl;
    private appId;
    private vapidPublicKey;
    constructor(options: InitOptions);
    /**
     * Get VAPID public key from server
     */
    private getVapidPublicKey;
    /**
     * Convert base64 string to Uint8Array for VAPID key
     */
    private urlBase64ToUint8Array;
    /**
     * Register service worker and subscribe to push notifications
     */
    registerDevice(options: RegisterDeviceOptions): Promise<void>;
    /**
     * Unregister device from push notifications
     */
    unregisterDevice(externalUserId: string): Promise<void>;
}
export declare function initNotificationClient(options: InitOptions): NotificationClient;
//# sourceMappingURL=client.d.ts.map