# 🚀 One-Click Deployment Checklist

## Pre-Deployment (Do These NOW)

- [ ] **Rotate Aiven Password** (Security!)
  - Go to https://console.aiven.io → MySQL service → Users
  - Change avnadmin password
  - Update `.env` file

- [ ] **Push Code to GitHub**
  ```bash
  git add .
  git commit -m "Ready for deployment"
  git push origin main
  ```

- [ ] **Verify .env is NOT committed**
  ```bash
  git log --oneline -- .env  # Should show NO results
  ```

---

## Deployment Steps (On Aiven Console)

### Step 1: Create Backend Service (Takes 5-10 min)
1. Go to https://console.aiven.io
2. Click **"Create Service"**
3. Select **"App Platform"**
4. Name: `password-checker-backend`
5. Link GitHub repo
6. Set environment variables (see DEPLOYMENT_AIVEN.md)
7. Click **"Create"** and wait

### Step 2: Create Frontend Service (Takes 5-10 min)
1. Click **"Create Service"** 
2. Select **"App Platform"**
3. Name: `password-checker-frontend`
4. Link GitHub repo (same)
5. Set environment variables
6. Click **"Create"** and wait

### Step 3: Test Deployment
```bash
# Backend health
curl https://password-checker-backend.aivenapp.io/api/health

# Frontend - open in browser
https://password-checker-frontend.aivenapp.io
```

---

## Expected Result

✅ Frontend loads at: `https://password-checker-frontend.aivenapp.io`
✅ Backend API works: `https://password-checker-backend.aivenapp.io/api`
✅ Database connected: Shows in logs "✅ Connected to Aiven MySQL"
✅ Data saves: Password checks appear in your Aiven database

---

## Estimated Time
- Setup: 5 minutes
- Deployment: 15-20 minutes
- Testing: 5 minutes
- **Total: ~30 minutes** ⏱️

---

## Cost After 30 Days
- Backend: $10/month
- Frontend: $10/month  
- Database: $19/month
- **Total: ~$39/month**

(First 30 days mostly free on trial credits)

---

## Support
- Full guide: See `DEPLOYMENT_AIVEN.md`
- Issues: Check Aiven Console → Logs
- Questions: Visit Aiven docs or community
