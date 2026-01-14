# 🚀 How to Run the Project

## ✅ CURRENT STATUS

**Both servers are RUNNING:**
- 🟢 Frontend: http://localhost:3000
- 🟢 Backend: http://localhost:3001

**Open your browser and visit: http://localhost:3000**

---

## 📋 COMMANDS FOR RUNNING PROJECT

### Method 1: Run Both Servers (Recommended)

#### Windows PowerShell / Command Prompt

**Terminal 1 - Backend:**
```powershell
cd backend
node local-server.js
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

### Method 2: One-Line Commands

#### Backend Only:
```powershell
cd backend; node local-server.js
```

#### Frontend Only:
```powershell
cd frontend; npm run dev
```

---

## 🔄 COMPLETE SETUP & RUN (First Time)

### Step 1: Install Dependencies

**Frontend:**
```powershell
cd frontend
npm install
```

**Backend:**
```powershell
cd backend
# No dependencies needed for mock server
```

### Step 2: Configure Environment

**Create frontend/.env.local:**
```powershell
cd frontend
echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
echo NEXT_PUBLIC_GOOGLE_MAPS_API_KEY= >> .env.local
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```powershell
cd backend
node local-server.js
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## 🎯 QUICK START (After First Setup)

### Option A: Using Two Terminals

**Terminal 1:**
```powershell
cd backend
node local-server.js
```

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

### Option B: Using PowerShell Script

Create a file `start.ps1` in project root:
```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node local-server.js"

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Servers starting..."
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:3001"
```

Then run:
```powershell
.\start.ps1
```

---

## 🛑 HOW TO STOP SERVERS

### Method 1: Close Terminal Windows
- Simply close the terminal windows running the servers

### Method 2: Keyboard Shortcut
- Press **Ctrl+C** in each terminal window

### Method 3: Kill Processes
```powershell
# Find processes
Get-Process node

# Kill all node processes
Stop-Process -Name node -Force

# Or kill specific ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

---

## 🔍 VERIFY SERVERS ARE RUNNING

### Check Frontend:
```powershell
curl http://localhost:3000
```

### Check Backend:
```powershell
curl -Method POST -Uri "http://localhost:3001/recommendation" -ContentType "application/json" -Body '{"state":"maharashtra","crop":"cotton","location":"Akola","quantity":50}'
```

### Check Ports:
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use

**Error:** "Port 3000 is already in use"

**Solution 1 - Kill Process:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Solution 2 - Use Different Port:**
```powershell
# Frontend on different port
cd frontend
$env:PORT=3002; npm run dev
```

### Frontend Can't Connect to Backend

**Check:**
1. Backend is running on port 3001
2. `.env.local` has correct API URL
3. No firewall blocking localhost

**Fix:**
```powershell
# Verify backend is running
curl http://localhost:3001/recommendation

# Check .env.local
cd frontend
type .env.local
```

### npm install Fails

**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
cd frontend
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

### Module Not Found Errors

**Solution:**
```powershell
cd frontend
npm install
```

---

## 📦 PACKAGE SCRIPTS

### Frontend (package.json)

```json
{
  "scripts": {
    "dev": "next dev",           // Development server
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "next lint"          // Linting
  }
}
```

**Usage:**
```powershell
cd frontend
npm run dev      # Development (hot reload)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

---

## 🌐 ACCESS URLS

### Frontend (User Interface)
```
http://localhost:3000
```

### Backend (API)
```
http://localhost:3001
```

### API Endpoints
```
POST http://localhost:3001/recommendation
GET  http://localhost:3001/analytics
```

---

## 🔧 DEVELOPMENT WORKFLOW

### Daily Development:

1. **Start servers:**
   ```powershell
   # Terminal 1
   cd backend
   node local-server.js
   
   # Terminal 2
   cd frontend
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Make changes:**
   - Edit files in `frontend/src/`
   - Frontend auto-reloads on save
   - Backend needs manual restart

4. **Test changes:**
   - Refresh browser
   - Check console for errors

5. **Stop servers:**
   - Press Ctrl+C in both terminals

---

## 📝 USEFUL COMMANDS

### Check Node Version:
```powershell
node --version
npm --version
```

### Update Dependencies:
```powershell
cd frontend
npm update
```

### Clear Next.js Cache:
```powershell
cd frontend
Remove-Item -Recurse -Force .next
npm run dev
```

### View Logs:
```powershell
# Frontend logs are in terminal
# Backend logs are in terminal
```

### Test API Manually:
```powershell
# Test recommendation endpoint
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/recommendation" -ContentType "application/json" -Body '{"state":"maharashtra","crop":"cotton","location":"Akola","quantity":50}' | ConvertTo-Json

# Test analytics endpoint
Invoke-RestMethod -Uri "http://localhost:3001/analytics?state=maharashtra" | ConvertTo-Json
```

---

## 🎨 DEVELOPMENT TIPS

### Hot Reload
- Frontend: ✅ Automatic (Next.js)
- Backend: ❌ Manual restart needed

### Browser DevTools
- Press **F12** to open
- Check Console for errors
- Use Network tab to see API calls

### VS Code Integration
- Install "ES7+ React/Redux/React-Native snippets"
- Install "Tailwind CSS IntelliSense"
- Install "ESLint"

---

## 📊 MONITORING

### Watch Backend Logs:
```powershell
cd backend
node local-server.js
# Logs appear in terminal
```

### Watch Frontend Logs:
```powershell
cd frontend
npm run dev
# Logs appear in terminal
```

### Browser Console:
- Open DevTools (F12)
- Check Console tab
- Look for errors or warnings

---

## 🚀 PRODUCTION BUILD

### Build Frontend:
```powershell
cd frontend
npm run build
```

### Run Production Build:
```powershell
cd frontend
npm run start
```

### Test Production Build:
```
http://localhost:3000
```

---

## 📋 CHECKLIST

Before running:
- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] Ports 3000 and 3001 available

To run:
- [ ] Start backend server (Terminal 1)
- [ ] Start frontend server (Terminal 2)
- [ ] Open http://localhost:3000
- [ ] Test the application

To stop:
- [ ] Press Ctrl+C in Terminal 1
- [ ] Press Ctrl+C in Terminal 2
- [ ] Close browser tabs

---

## 🎯 QUICK REFERENCE

| Action | Command |
|--------|---------|
| Start Backend | `cd backend; node local-server.js` |
| Start Frontend | `cd frontend; npm run dev` |
| Stop Server | `Ctrl+C` |
| Install Dependencies | `cd frontend; npm install` |
| Clear Cache | `cd frontend; Remove-Item -Recurse -Force .next` |
| Check Ports | `netstat -ano \| findstr :3000` |
| Kill Process | `taskkill /PID <PID> /F` |
| View Frontend | `http://localhost:3000` |
| Test API | `curl http://localhost:3001/recommendation` |

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when:
- ✅ Backend shows: "🚀 Mock Backend Server running on http://localhost:3001"
- ✅ Frontend shows: "✓ Ready in 2.6s"
- ✅ Browser opens http://localhost:3000 without errors
- ✅ You see the state selection page
- ✅ No errors in browser console

---

## 📞 NEED HELP?

### Common Issues:
1. **Port in use** → Kill process or use different port
2. **Module not found** → Run `npm install`
3. **API not responding** → Check backend is running
4. **Page not loading** → Check frontend is running
5. **Blank page** → Check browser console for errors

### Check Status:
```powershell
# List running processes
Get-Process node

# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

---

**🎊 You're all set! Run the commands and enjoy your application!**
