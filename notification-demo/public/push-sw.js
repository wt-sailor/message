self.addEventListener('push', async (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const { title, body, icon, click_action } = data;

  // Check if any client (tab/window) is currently focused
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });

  let hasVisibleClient = false;
  for (const client of clients) {
    if (client.visibilityState === 'visible' && client.focused) {
      hasVisibleClient = true;
      // Send message to the visible client for in-app notification
      client.postMessage({
        type: 'IN_APP_NOTIFICATION',
        notification: { title, body, icon, click_action }
      });
      break;
    }
  }

  // If no visible client, show push notification
  if (!hasVisibleClient) {
    const options = {
      body: body || '',
      icon: icon || '/icon.png',
      badge: '/badge.png',
      tag: 'notification-' + Date.now(),
      requireInteraction: false,
      data: {
        url: click_action || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(title || 'Notification', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});
