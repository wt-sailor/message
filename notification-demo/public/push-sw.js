self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const { title, body, icon, click_action } = data;

  const options = {
    body: body || '',
    icon: icon || '/icon.png',
    badge: '/badge.png',
    data: {
      url: click_action || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title || 'Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});
