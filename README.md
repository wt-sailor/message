# FCM Clone Platform

A complete Firebase Cloud Messaging–style notification platform with multi-tenant support, admin approval workflow, and external SDK integration.

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple apps with isolated credentials
- **Admin Approval Workflow**: Super admin can approve/ban users and set app limits
- **Push Notifications**: Send both display and silent push notifications
- **Web Push Integration**: Full Web Push API support with VAPID keys
- **JavaScript SDK**: Easy-to-use SDK for client-side integration
- **REST API**: Backend API for sending notifications from your server
- **Real-time Tracking**: Monitor notification delivery status and device management
- **Modern Stack**: Node.js + Express + PostgreSQL + React + TypeScript

## 📁 Project Structure

```
message/
├── server/          # Backend API (Node.js + Express + TypeScript)
├── frontend/        # Admin Panel + Landing (React + Vite + TypeScript)
└── sdk/             # External JavaScript SDK
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Generate VAPID keys
npx web-push generate-vapid-keys

# Copy and configure environment
cp .env.example .env
# Edit .env with your database URL, JWT secret, VAPID keys, and super admin credentials

# Setup database
npm run db:setup

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. SDK Setup

```bash
cd sdk

# Install dependencies
npm install

# Build SDK
npm run build
```

The built SDK will be in `sdk/dist/`

## 📖 Usage Guide

### For Platform Admins

1. **Sign Up**: Create an account at `http://localhost:5173/signup`
2. **Wait for Approval**: Super admin must approve your account
3. **Create App**: Once approved, create an app to get credentials
4. **Get Credentials**: Copy your `appId` and `secretKey` from the app details page

### For Third-Party App Integration

#### Frontend Integration

1. **Copy Service Worker**: Copy `sdk/examples/push-sw.js` to your `public/` directory

2. **Install SDK** (when published):
   ```bash
   npm install fcm-clone-sdk
   ```

3. **Initialize and Register**:
   ```javascript
   import { initNotificationClient } from 'fcm-clone-sdk';

   const client = initNotificationClient({
     baseUrl: 'http://localhost:3000',
     appId: 'your-app-id'
   });

   // When user logs in
   await client.registerDevice({
     externalUserId: 'user-123',
     serviceWorkerPath: '/push-sw.js'
   });
   ```

#### Backend Integration

Send push notifications from your server:

```javascript
const response = await fetch('http://localhost:3000/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appId: 'your-app-id',
    secretKey: 'your-secret-key',
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
});
```

## 🔑 Default Super Admin

The super admin account is created automatically on first run using credentials from `.env`:

- Email: `SUPER_ADMIN_EMAIL` from .env
- Password: `SUPER_ADMIN_PASSWORD` from .env

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - Register new admin user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Super Admin Endpoints

- `GET /admin/users` - List all users
- `PATCH /admin/users/:id/status` - Approve/ban users
- `PATCH /admin/users/:id/app-limit` - Set app creation limit
- `POST /admin/users/:id/warn` - Send warning to user

### App Management Endpoints

- `GET /apps` - List user's apps
- `POST /apps` - Create new app
- `GET /apps/:id` - Get app details with stats
- `PATCH /apps/:id` - Update app info
- `POST /apps/:id/rotate-secret` - Rotate secret key
- `DELETE /apps/:id` - Deactivate app

### SDK Integration Endpoints

- `GET /sdk/vapid-public-key` - Get VAPID public key
- `POST /sdk/register-device` - Register device token
- `POST /sdk/unregister-device` - Unregister device

### Push Notification Endpoint

- `POST /api/push/send` - Send push notification (requires appId + secretKey)

## 🏗️ Architecture

### Backend

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with raw SQL queries (no ORM)
- **Authentication**: JWT-based with bcrypt password hashing
- **Push Notifications**: web-push library with VAPID authentication
- **Rate Limiting**: Express rate limiter

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors

### SDK

- **Language**: TypeScript
- **Build**: Rollup (ESM + CommonJS)
- **Browser APIs**: Service Worker, Push API, Notification API

## 🔒 Security Considerations

- **Secret Keys**: Never expose `secretKey` in client-side code
- **HTTPS Required**: Push notifications require HTTPS in production
- **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
- **Rate Limiting**: Basic in-memory rate limiting (use Redis for production)
- **VAPID Keys**: Keep private key secure, never commit to version control

## 🚀 Production Deployment

1. **Database**: Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
2. **Backend**: Deploy to Node.js hosting (Heroku, DigitalOcean, AWS, etc.)
3. **Frontend**: Build and deploy to static hosting (Vercel, Netlify, etc.)
4. **Environment**: Update all URLs and secrets for production
5. **HTTPS**: Ensure all services use HTTPS
6. **Rate Limiting**: Consider Redis-based rate limiting for scalability

## 📝 License

MIT

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your needs.
