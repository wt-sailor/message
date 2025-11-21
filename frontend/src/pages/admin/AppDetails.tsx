import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAppById, rotateAppSecret } from '../../services/appService';
import { AppWithStats } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';

export const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    if (id) loadApp();
  }, [id]);

  const loadApp = async () => {
    try {
      const data = await getAppById(parseInt(id!));
      setApp(data);
    } catch (error) {
      console.error('Failed to load app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateSecret = async () => {
    if (!confirm('Are you sure? This will invalidate the current secret key.')) return;
    
    setRotating(true);
    try {
      const updated = await rotateAppSecret(parseInt(id!));
      setApp(prev => prev ? { ...prev, ...updated } : null);
    } catch (error) {
      alert('Failed to rotate secret');
    } finally {
      setRotating(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!app) return <div className="p-8">App not found</div>;

  const integrationCode = `// 1. Include the SDK
import { initNotificationClient } from 'fcm-clone-sdk';

// 2. Initialize
const client = initNotificationClient({
  baseUrl: '${window.location.origin.replace('5173', '3000')}',
  appId: '${app.public_app_id}'
});

// 3. Register device when user logs in
await client.registerDevice({
  externalUserId: 'user-123', // Your app's user ID
  serviceWorkerPath: '/push-sw.js'
});`;

  const backendCode = `// Send push notification from your backend
const response = await fetch('${window.location.origin.replace('5173', '3000')}/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appId: '${app.public_app_id}',
    secretKey: '${app.secret_key}',
    notification: {
      title: 'Hello!',
      body: 'This is a push notification',
      icon: '/icon.png',
      click_action: 'https://your-app.com'
    },
    targets: {
      externalUserIds: ['user-123'] // or { all: true }
    }
  })
});`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{app.name}</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Devices</h3>
          <p className="text-3xl font-bold text-primary-600">{app.device_count}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Notifications Sent</h3>
          <p className="text-3xl font-bold text-green-600">{app.notification_count}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Status</h3>
          <p className="text-xl font-semibold">{app.is_active ? '✅ Active' : '❌ Inactive'}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Credentials</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">App ID (Public)</label>
            <div className="flex space-x-2">
              <input value={app.public_app_id} readOnly className="input flex-1" />
              <CopyButton text={app.public_app_id} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secret Key</label>
            <div className="flex space-x-2">
              <input value={app.secret_key} readOnly className="input flex-1" type="password" />
              <CopyButton text={app.secret_key} />
              <button onClick={handleRotateSecret} disabled={rotating} className="btn-danger">
                {rotating ? 'Rotating...' : 'Rotate'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Keep this secret! Never expose it in client-side code.</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Frontend Integration</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          {integrationCode}
        </pre>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Backend Integration</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          {backendCode}
        </pre>
      </div>
    </div>
  );
};
