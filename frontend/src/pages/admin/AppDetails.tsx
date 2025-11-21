import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAppById, rotateAppSecret, updateApp, deleteApp } from '../../services/appService';
import { AppWithStats } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';

export const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<AppWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) loadApp();
  }, [id]);

  const loadApp = async () => {
    try {
      const data = await getAppById(parseInt(id!));
      setApp(data);
      setEditName(data.name);
      setEditDescription(data.description || '');
    } catch (error) {
      console.error('Failed to load app:', error);
      toast.error('Failed to load app details');
    } finally {
      setLoading(false);
    }
  };

  const handleRotateSecret = async () => {
    const confirmed = window.confirm('Are you sure? This will invalidate the current secret key.');
    if (!confirmed) return;
    
    setRotating(true);
    try {
      const updated = await rotateAppSecret(parseInt(id!));
      setApp(prev => prev ? { ...prev, ...updated } : null);
      toast.success('Secret key rotated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to rotate secret');
    } finally {
      setRotating(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateApp(parseInt(id!), {
        name: editName,
        description: editDescription || undefined,
      });
      setApp(prev => prev ? { ...prev, ...updated } : null);
      setIsEditing(false);
      toast.success('App updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update app');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteApp(parseInt(id!));
      toast.success('App deleted successfully');
      navigate('/apps');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete app');
      setDeleting(false);
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
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-3xl font-bold border-b-2 border-primary-600 focus:outline-none w-full"
                placeholder="App Name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="App Description (optional)"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(app.name);
                    setEditDescription(app.description || '');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{app.name}</h1>
              {app.description && (
                <p className="text-gray-600 mt-2">{app.description}</p>
              )}
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold mb-2">Delete App?</h3>
          <p className="text-red-700 mb-4">
            This will permanently delete this app and all associated devices and notifications. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete App'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
