import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchApps } from '../../store/slices/appsSlice';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { apps, loading } = useAppSelector((state) => state.apps);

  useEffect(() => {
    dispatch(fetchApps());
  }, [dispatch]);

  if (loading && apps.length === 0) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Apps</h3>
          <p className="text-3xl font-bold text-primary-600">{apps.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Active Apps</h3>
          <p className="text-3xl font-bold text-green-600">
            {apps.filter(app => app.is_active).length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Quick Actions</h3>
          <Link to="/apps" className="btn-primary mt-2 inline-block">
            Manage Apps
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Apps</h2>
        {apps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't created any apps yet.</p>
            <Link to="/apps" className="btn-primary">
              Create Your First App
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.slice(0, 5).map(app => (
              <Link
                key={app.id}
                to={`/apps/${app.id}`}
                className="block p-4 border rounded-lg hover:border-primary-500 transition"
              >
                <h3 className="font-semibold">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.description || 'No description'}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
