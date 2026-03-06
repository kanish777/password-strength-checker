# 🚀 Aiven App Platform Deployment Guide

## Overview
This guide walks you through deploying the Password Strength Checker to Aiven App Platform.

### Architecture
```
┌─────────────────┐
│  Aiven App      │
│  Platform       │
├─────────────────┤
│ Frontend        │ → https://frontend-service.aivenapp.io
│ (Nginx)         │
│                 │
│ Backend         │ → https://backend-service.aivenapp.io
│ (Node.js)       │
│                 │
│ MySQL Database  │ → Aiven MySQL (cloud)
└─────────────────┘
```

---

## Prerequisites
- Aiven Account (with active MySQL service)
- Docker installed locally (optional - Aiven builds from Git)
- Git repository with your code pushed
- GitHub/GitLab account linked to Aiven

---

## Step 1: Prepare Your Repository

### 1. Add .gitignore
Make sure your `.env` file is NOT committed:

```bash
# In project root, update .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy configuration for Aiven"
git push origin main
```

---

## Step 2: Create Backend Service

### 1. Go to Aiven Console
- https://console.aiven.io
- Click **"Create Service"**

### 2. Select App Platform
- Choose **"App Platform"** 
- Select your project
- Click **"Create Service"**

### 3. Configure Backend Service
- **Service Name:** `password-checker-backend`
- **Runtime:** Node.js 18+

### 4. Build Configuration
Under "Build" section:
- **Build Command:** `cd backend && npm install && npm install -g pm2`
- **Start Command:** `cd backend && node server.js`
- **Repository:** Link your GitHub repository
- **Branch:** `main`

### 5. Set Environment Variables
Click "Environment variables" and add:
```
AIVEN_MYSQL_HOST=password-checker-mysql-task-manager-345.a.aivencloud.com
AIVEN_MYSQL_PORT=11971
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=YOUR_AIVEN_PASSWORD
AIVEN_MYSQL_DATABASE=defaultdb
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://password-checker-frontend.aivenapp.io
```

### 6. Configure Networking
- **Port:** 3001
- **Auto-scaling:** Enabled (optional)
- **Public access:** Enabled

### 7. Deploy
Click **"Create"** and wait for deployment (5-10 minutes)

**Your backend will be at:** `https://password-checker-backend.aivenapp.io`

---

## Step 3: Create Frontend Service

### 1. Create Another App Platform Service
- Click **"Create Service"** → **"App Platform"**
- **Service Name:** `password-checker-frontend`
- **Runtime:** Node.js 18+

### 2. Build Configuration
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm install -g serve && serve -s dist -l 8080`
- **Repository:** Same GitHub repo
- **Branch:** `main`

### 3. Environment Variables
```
VITE_API_URL=https://password-checker-backend.aivenapp.io/api
NODE_ENV=production
```

### 4. Configure Networking
- **Port:** 8080
- **Public access:** Enabled
- **Domain:** Configure custom domain (optional)

### 5. Deploy
Click **"Create"** and wait for deployment

**Your frontend will be at:** `https://password-checker-frontend.aivenapp.io`

---

## Step 4: Update Environment Variables

After deployment completes, update variables:

### Backend (update FRONTEND_URL)
```
FRONTEND_URL=https://password-checker-frontend.aivenapp.io
```

### Frontend (update API URL)
```
VITE_API_URL=https://password-checker-backend.aivenapp.io/api
```

---

## Step 5: Test Deployment

### Test Backend Health
```bash
curl https://password-checker-backend.aivenapp.io/api/health
```

Expected response:
```json
{"status":"healthy","database":"connected"...}
```

### Test Frontend
Open in browser:
```
https://password-checker-frontend.aivenapp.io
```

Should load without errors and connect to the backend.

---

## Step 6: Monitor & Logs

### View Logs
1. Go to Aiven Console
2. Open your service
3. **"Logs"** tab
4. Check for errors or warnings

### Monitor Performance
- **"Metrics"** tab shows CPU, memory, requests
- **"Activity"** tab shows deployment history

---

## Troubleshooting

### Backend Not Connecting to Database
- Check `AIVEN_MYSQL_HOST`, `PORT`, `USER`, `PASSWORD` in environment variables
- Verify Aiven MySQL service is running
- Check logs for connection errors

### Frontend Showing Blank Page
- Check `VITE_API_URL` environment variable
- Verify build process completed (check logs)
- Check browser console for errors (F12)

### API Calls Failing
- Check CORS settings (should be enabled)
- Verify backend is running (`/api/health` endpoint)
- Check `FRONTEND_URL` on backend matches frontend domain

### HTTPS Certificate Issues
- Aiven provides free SSL certificates
- May take 24 hours to fully activate
- Check under "Networking" → "Domain Management"

---

## Updating Your Application

### Deploy New Changes
1. Make code changes locally
2. Test thoroughly
3. Push to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```

4. Aiven auto-deploys from Git
5. Check deployment progress in App Platform logs

---

## Cost Considerations

**Aiven App Platform Pricing:**
- **Free tier:** 1 service (small)
- **Starter (first 30 days free):** $10/month per service
- **Business:** $100/month per service

**Total estimated cost:**
- Backend service: $10/month
- Frontend service: $10/month
- MySQL database: $19/month (smallest paid tier)
- **Total: ~$40/month** (first month cheaper)

Upgrade to larger instances as needed based on traffic.

---

## DNS & Custom Domain (Optional)

To use your own domain (e.g., `passwordchecker.com`):

1. In Aiven Console → Frontend Service → "Networking"
2. Click "Add domain"
3. Update your DNS provider:
   - Add CNAME record pointing to Aiven endpoint
   - Example: `frontend.passwordchecker.com → CNAME → your-aiven-domain.aivenapp.io`

---

## Rollback on Error

If deployment fails:
1. Go to App Platform service
2. **"Activity"** tab
3. Find previous working version
4. Click **"Redeploy"** on successful version

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Monitor logs for errors
3. ✅ Set up automated backups
4. ✅ Configure alerts for service health
5. ✅ Plan scaling strategy

Happy deploying! 🎉
