import React from 'react';

export const Docs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-4 text-gray-700">
          <p>Follow these steps to integrate push notifications into your web application:</p>
          
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">1. Create an Account</h3>
            <p>Sign up on our platform and wait for super admin approval.</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">2. Create an App</h3>
            <p>Once approved, create an app to receive your <code className="bg-gray-100 px-2 py-1 rounded">appId</code> and <code className="bg-gray-100 px-2 py-1 rounded">secretKey</code>.</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">3. Setup Service Worker</h3>
            <p>Create a service worker file (<code className="bg-gray-100 px-2 py-1 rounded">push-sw.js</code>) in your public directory:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  
  if (data.silent) {
    // Handle silent notification
    console.log('Silent push received:', data);
    return;
  }
  
  const { title, body, icon, image, click_action } = data;
  
  event.waitUntil(
    self.registration.showNotification(title || 'Notification', {
      body,
      icon,
      image,
      data: { click_action }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.click_action || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});`}
            </pre>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">4. Install SDK</h3>
            <p>Install the FCM Clone SDK in your project:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`npm install fcm-clone-sdk`}
            </pre>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">5. Initialize SDK</h3>
            <p>In your application code:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`import { initNotificationClient } from 'fcm-clone-sdk';

const client = initNotificationClient({
  baseUrl: 'http://localhost:3000',
  appId: 'your-app-id'
});

// Register device when user logs in
await client.registerDevice({
  externalUserId: 'user-123',
  serviceWorkerPath: '/push-sw.js'
});`}
            </pre>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">6. Send Notifications from Backend</h3>
            <p>Call the push API from your server:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`const response = await fetch('http://localhost:3000/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appId: 'your-app-id',
    secretKey: 'your-secret-key',
    notification: {
      title: 'Hello!',
      body: 'This is a test notification',
      icon: '/icon.png',
      image: '/banner.jpg',
      click_action: 'https://your-app.com/page',
      silent: false
    },
    targets: {
      externalUserIds: ['user-123'] // or { all: true }
    }
  })
});

const result = await response.json();
console.log(result);`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        
        <div className="card mb-4">
          <h3 className="font-semibold text-lg mb-2">POST /api/push/send</h3>
          <p className="text-sm text-gray-600 mb-3">Send a push notification to devices</p>
          <div className="text-sm">
            <p className="font-medium mb-1">Request Body:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><code className="bg-gray-100 px-1">appId</code> (string) - Your app ID</li>
              <li><code className="bg-gray-100 px-1">secretKey</code> (string) - Your secret key</li>
              <li><code className="bg-gray-100 px-1">notification</code> (object) - Notification payload</li>
              <li><code className="bg-gray-100 px-1">targets</code> (object, optional) - Target users</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Notification Object</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li><code className="bg-gray-100 px-1">title</code> (string, required) - Notification title</li>
            <li><code className="bg-gray-100 px-1">body</code> (string, optional) - Notification body</li>
            <li><code className="bg-gray-100 px-1">icon</code> (string, optional) - Icon URL</li>
            <li><code className="bg-gray-100 px-1">image</code> (string, optional) - Image URL</li>
            <li><code className="bg-gray-100 px-1">click_action</code> (string, optional) - URL to open on click</li>
            <li><code className="bg-gray-100 px-1">silent</code> (boolean, optional) - Silent notification (no UI)</li>
            <li><code className="bg-gray-100 px-1">data</code> (object, optional) - Custom data payload</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-3 text-gray-700">
          <div className="card">
            <h3 className="font-semibold mb-2">🔒 Security</h3>
            <p>Never expose your <code className="bg-gray-100 px-1">secretKey</code> in client-side code. Only use it on your backend server.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📱 User Experience</h3>
            <p>Always request notification permission at an appropriate time, not immediately on page load.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">⚡ Performance</h3>
            <p>Use silent notifications for background data sync to avoid overwhelming users with UI notifications.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
