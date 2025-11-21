import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Push Notifications Made Simple
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              A powerful FCM-like notification backend for your web applications.
              Multi-tenant, secure, and easy to integrate.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started
              </Link>
              <Link to="/docs" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition">
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Simple JavaScript SDK and REST API. Get started in minutes with our comprehensive documentation.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Multi-tenant</h3>
              <p className="text-gray-600">
                App-based authentication with secret keys. Super admin approval workflow for enhanced security.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track notification delivery status, manage devices, and monitor your app's performance.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold mb-2">Display & Silent Notifications</h3>
              <p className="text-gray-600">
                Send both visible notifications and silent data-only pushes for background updates.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Targeted Messaging</h3>
              <p className="text-gray-600">
                Send notifications to specific users or broadcast to all devices in your app.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">High Performance</h3>
              <p className="text-gray-600">
                Built with Node.js and PostgreSQL for reliable, scalable notification delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up and wait for super admin approval to access the platform.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your App</h3>
                <p className="text-gray-600">Get your unique App ID and Secret Key for authentication.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrate the SDK</h3>
                <p className="text-gray-600">Add our JavaScript SDK to your web app and register devices.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Send Notifications</h3>
                <p className="text-gray-600">Use our REST API from your backend to send push notifications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join today and start sending push notifications in minutes.
          </p>
          <Link to="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};
