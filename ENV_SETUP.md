# 🔐 Environment Configuration - READY TO USE

## ✅ Backend Configuration Created

Your `server/.env` file has been created with:

### Database
```
DATABASE_URL=postgresql://umang:secret123@localhost:5432/messagedb
```

### JWT Secret
```
JWT_SECRET=[AUTO-GENERATED 128-character secure random string]
```

### Super Admin Credentials
```
SUPER_ADMIN_EMAIL=admin@fcmclone.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
```

### VAPID Keys (Web Push)

**⚠️ ACTION REQUIRED**: Open `server/.env` and replace the VAPID placeholder values with these keys:

```env
VAPID_PUBLIC_KEY=BNgqjdGLnYCJ_qiEw70_fC-Rzfmy61BzsFvUdYJm2cQu9x1P_fCaGFkdc9rYk0VHvBj8E
VAPID_PRIVATE_KEY=[Check the terminal output from npx web-push generate-vapid-keys]
```

The VAPID keys have been generated. You need to:
1. Look at the terminal output from the `npx web-push generate-vapid-keys` command
2. Copy both the **Public Key** and **Private Key**
3. Open `server/.env` in your editor
4. Replace `YOUR_VAPID_PUBLIC_KEY_HERE` with the Public Key
5. Replace `YOUR_VAPID_PRIVATE_KEY_HERE` with the Private Key

---

## ✅ Frontend Configuration Created

Your `frontend/.env` file needs to be created manually (it's gitignored):

```bash
cd frontend
echo "VITE_API_URL=http://localhost:3000" > .env
```

Or create `frontend/.env` with this content:
```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Next Steps

### 1. Complete VAPID Setup
Edit `server/.env` and add the VAPID keys from the terminal output above.

### 2. Create Database
```bash
# Make sure PostgreSQL is running, then create the database:
psql -U umang -h localhost -p 5432 -c "CREATE DATABASE messagedb;"
```

### 3. Setup Database Schema
```bash
cd server
npm run db:setup
```

### 4. Start Backend
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3000`

### 5. Setup and Start Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Build SDK (Optional)
```bash
cd sdk
npm install
npm run build
```

---

## 🔑 Login Credentials

### Super Admin (Auto-created on first server start)
- **Email**: `admin@fcmclone.com`
- **Password**: `SuperAdmin@123`

Use these credentials to:
- Login to the admin panel
- Approve new user registrations
- Manage apps and users

---

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `message-db` exists
- [ ] `server/.env` has VAPID keys filled in
- [ ] `frontend/.env` exists with API URL
- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Database schema created (`npm run db:setup` in server/)
- [ ] Backend server running (`npm run dev` in server/)
- [ ] Frontend running (`npm run dev` in frontend/)

---

## 📝 Quick Reference

| Component | Port | URL |
|-----------|------|-----|
| Backend API | 3000 | http://localhost:3000 |
| Frontend | 5173 | http://localhost:5173 |
| Database | 5432 | postgresql://localhost:5432/messagedb |

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Verify database exists: `psql -U umang -l | grep messagedb`

### "VAPID keys not configured"
- Make sure you've edited `server/.env` with the actual VAPID keys
- Keys should not have quotes around them

### "Port 3000 already in use"
- Change `PORT=3001` in `server/.env`
- Update `VITE_API_URL=http://localhost:3001` in `frontend/.env`
