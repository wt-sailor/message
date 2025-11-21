# FCM Clone SDK

JavaScript SDK for integrating FCM Clone push notifications into your web application.

## Installation

```bash
npm install fcm-clone-sdk
```

## Usage

### 1. Create a Service Worker

Create a file `public/push-sw.js`:

```javascript
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  if (data.silent) {
    // Handle silent notification
    return;
  }
  
  const title = data.title || 'Notification';
  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image,
    data: { click_action: data.click_action }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.click_action || '/';
  event.waitUntil(clients.openWindow(url));
});
```

### 2. Initialize SDK

```javascript
import { initNotificationClient } from 'fcm-clone-sdk';

const client = initNotificationClient({
  baseUrl: 'http://localhost:3000',
  appId: 'your-app-id'
});
```

### 3. Register Device

```javascript
// When user logs in
await client.registerDevice({
  externalUserId: 'user-123',
  serviceWorkerPath: '/push-sw.js' // optional, defaults to '/push-sw.js'
});
```

### 4. Unregister Device

```javascript
// When user logs out
await client.unregisterDevice('user-123');
```

## API Reference

### `initNotificationClient(options)`

Initialize the notification client.

**Parameters:**
- `options.baseUrl` (string): Base URL of your FCM Clone backend
- `options.appId` (string): Your app ID from the admin panel

**Returns:** `NotificationClient`

### `client.registerDevice(options)`

Register a device for push notifications.

**Parameters:**
- `options.externalUserId` (string): Your app's user ID
- `options.serviceWorkerPath` (string, optional): Path to service worker file

**Returns:** `Promise<void>`

### `client.unregisterDevice(externalUserId)`

Unregister a device from push notifications.

**Parameters:**
- `externalUserId` (string): Your app's user ID

**Returns:** `Promise<void>`

## Example

See `examples/integration.html` for a complete working example.

## License

MIT
