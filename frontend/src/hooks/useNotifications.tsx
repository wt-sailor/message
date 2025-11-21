import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initNotificationClient } from 'fcm-clone-sdk';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    const initializeNotifications = async () => {
      // Only initialize for logged-in, approved users
      if (!user || user.status !== 'APPROVED') {
        return;
      }

      try {
        // Check if notifications are supported
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
        }

        // Check current permission status
        if (Notification.permission === 'denied') {
          console.log('Notification permission denied');
          return;
        }

        // Initialize the notification client with internal app
        const client = initNotificationClient({
          baseUrl: API_URL,
          appId: 'internal-admin-app', // This will be created by the backend
        });

        // Register device for push notifications
        // This will trigger the browser permission prompt
        await client.registerDevice({
          externalUserId: `admin_${user.id}`,
          serviceWorkerPath: '/push-sw.js',
        });

        console.log('✅ Notifications initialized successfully');
      } catch (error: any) {
        // Don't show error if user just dismissed the permission prompt
        if (error.message !== 'Notification permission denied') {
          console.error('Failed to initialize notifications:', error);
        }
      }
    };

    initializeNotifications();
  }, [user]);

  // Listen for foreground notifications
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FOREGROUND_PUSH') {
        const { title, body } = event.data.payload;
        // Show toast notification
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/icon.png"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {body}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ), { duration: 5000 });
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);
};
