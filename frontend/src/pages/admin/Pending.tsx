import React from 'react';

export const Pending: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full card text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold mb-4">Account Pending Approval</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully. Please wait for a super admin
          to approve your account before you can create apps and send notifications.
        </p>
        <p className="text-sm text-gray-500">
          You will be notified once your account is approved.
        </p>
      </div>
    </div>
  );
};
