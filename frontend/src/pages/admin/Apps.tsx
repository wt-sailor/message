import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApps, createApp } from '../../services/appService';
import { App } from '../../types';

export const Apps: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await getApps();
      setApps(data);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await createApp({ name, description });
      setShowCreateModal(false);
      setName('');
      setDescription('');
      loadApps();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create app');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Apps</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + Create App
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any apps yet.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Create Your First App
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map(app => (
            <Link key={app.id} to={`/apps/${app.id}`} className="card hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{app.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${app.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {app.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{app.description || 'No description'}</p>
              <div className="text-xs text-gray-500">
                <p>App ID: {app.public_app_id}</p>
                <p>Created: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create New App</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" disabled={creating} className="btn-primary flex-1">
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
