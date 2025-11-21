import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserStatus, updateUserAppLimit, createWarning } from '../../services/adminService';
import { User, UserStatus } from '../../types';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [appLimit, setAppLimit] = useState<string>('');
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers(filter === 'ALL' ? undefined : filter);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, status: UserStatus) => {
    try {
      await updateUserStatus(userId, status);
      loadUsers();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleAppLimitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const limit = appLimit === '' ? null : parseInt(appLimit);
      await updateUserAppLimit(selectedUser.id, limit);
      setSelectedUser(null);
      setAppLimit('');
      loadUsers();
    } catch (error) {
      alert('Failed to update app limit');
    }
  };

  const handleWarningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !warningMessage) return;

    try {
      await createWarning(selectedUser.id, warningMessage);
      setSelectedUser(null);
      setWarningMessage('');
      alert('Warning sent successfully');
    } catch (error) {
      alert('Failed to send warning');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <div className="mb-6 flex space-x-2">
        {(['ALL', 'PENDING', 'APPROVED', 'BANNED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? 'btn-primary' : 'btn-secondary'}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">App Limit</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3">{user.app_limit ?? 'Unlimited'}</td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    {user.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleStatusChange(user.id, 'APPROVED')}
                        className="text-xs btn-primary"
                      >
                        Approve
                      </button>
                    )}
                    {user.status !== 'BANNED' && (
                      <button
                        onClick={() => handleStatusChange(user.id, 'BANNED')}
                        className="text-xs btn-danger"
                      >
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setAppLimit(user.app_limit?.toString() || '');
                      }}
                      className="text-xs btn-secondary"
                    >
                      Set Limit
                    </button>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-xs btn-secondary"
                    >
                      Warn
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* App Limit Modal */}
      {selectedUser && appLimit !== undefined && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Set App Limit for {selectedUser.name}</h2>
            <form onSubmit={handleAppLimitSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  App Limit (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={appLimit}
                  onChange={(e) => setAppLimit(e.target.value)}
                  className="input"
                  min="0"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setAppLimit(''); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {selectedUser && warningMessage !== undefined && appLimit === undefined && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Send Warning to {selectedUser.name}</h2>
            <form onSubmit={handleWarningSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Warning Message</label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="input"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">Send</button>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setWarningMessage(''); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
