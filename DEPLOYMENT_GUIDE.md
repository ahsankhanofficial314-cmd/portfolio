# Portfolio Deployment Guide - Vercel Production Setup

## 🎯 Issues Fixed
✅ Simplified monorepo configuration (root vercel.json only)
✅ Fixed CORS to accept all Vercel domains + localhost
✅ Smart API URL detection (frontend auto-detects backend based on domain)
✅ Flexible environment variable setup

---

## 📋 Step-by-Step Deployment

### 1️⃣ Install Vercel CLI
```bash
npm install -g vercel
```

### 2️⃣ Link Project to Vercel (Do This Once)
```bash
vercel link
```
- Follow prompts to link your portfolio project
- This creates `.vercel/project.json` (don't commit this)

### 3️⃣ Set Environment Variables on Vercel

Go to your Vercel Dashboard → Project Settings → Environment Variables

Add these 3 variables:

```
MONGO_URI = mongodb://ahsankhan:NOC72PwPGXghJBqn@ac-qheuklc-shard-00-00.l9yhh1p.mongodb.net:27017,ac-qheuklc-shard-00-01.l9yhh1p.mongodb.net:27017,ac-qheuklc-shard-00-02.l9yhh1p.mongodb.net:27017/portfolio?authSource=admin&retryWrites=true&w=majority&tls=true

EMAIL_USER = ahsankhanofficial314@gmail.com

EMAIL_PASS = ahsankhan0099
```

**⚠️ Note:** Copy these values from your local `.env` file. These variables are only available in Vercel's production environment.

### 4️⃣ Deploy to Production
```bash
vercel --prod
```

Or simply commit and push to GitHub - Vercel auto-deploys.

---

## 🔍 Architecture - How It Works Now

### Monorepo Structure
```
portfolio/
├── vercel.json          ← Handles routing for BOTH frontend & backend
├── backend/
│   ├── index.js         ← Express API server
│   └── package.json
├── frontend/
│   ├── index.html       ← Main entry point
│   ├── script.js        ← Auto-detects API_URL
│   └── package.json
```

### API Flow
1. **Frontend** → `GET ` window.location.hostname`
2. If `localhost` → Use `http://localhost:5000`
3. If `*.vercel.app` → Use `https://[same-domain]/api/contact`
4. **Backend** at `vercel.json` routes `/api/*` → `backend/index.js`

### Example Request
```
Frontend: https://myportfolio.vercel.app
  ↓
Auto-detects: Use same domain
  ↓
POST https://myportfolio.vercel.app/api/contact
  ↓
Vercel routes to: backend/index.js (/api/contact handler)
  ↓
Backend sends email & saves to MongoDB
```

---

## ✉️ Email Testing

### Test Flow
1. Go to your portfolio website
2. Fill contact form with test data
3. Submit
4. Check your inbox at `ahsankhanofficial314@gmail.com`

### If Email Not Received
**Check these in order:**

1. **Verify Gmail App Password**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select `Mail` and `Windows`
   - Generate new password
   - Copy exact 16-character password to Vercel env vars

2. **Check 2FA is Enabled**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Verify "2-Step Verification" is ON

3. **Check Vercel Logs**
   ```bash
   vercel logs --follow
   ```
   Look for email errors

4. **Check CORS Issues**
   - Open browser DevTools → Network tab
   - Check if POST request shows CORS error
   - If yes, add frontend domain to `backend/index.js` allowedOrigins

---

## 🛡️ Best Practices for Production

### ✅ DO
- ✅ Keep `EMAIL_PASS` only in Vercel env vars (not in git)
- ✅ Use App Passwords (not main Gmail password)
- ✅ Monitor Vercel logs: `vercel logs --follow`
- ✅ Test email with yourself first
- ✅ Add rate limiting for contact form (optional)

### ❌ DON'T
- ❌ Commit `.env` to git
- ❌ Use main Gmail password (security risk)
- ❌ Hardcode API URLs
- ❌ Disable CORS for production

---

## 📊 What's Different from Local Dev

| Feature | Local Dev | Production |
|---------|-----------|-----------|
| Backend | `http://localhost:5000` | `https://[yourdomain].vercel.app` |
| Frontend | `http://localhost:5173` | `https://[yourdomain].vercel.app` |
| API Route | `/api/contact` | `/api/contact` (same) |
| CORS | Any localhost | Configured domains only |
| Email | From `.env` | From Vercel env vars |

---

## 🚀 Common Issues & Solutions

### ❌ "Network Error" on Form Submit
**Cause:** Frontend can't reach backend API
**Fix:** 
1. Check Vercel domain is correct
2. Verify CORS settings
3. Check Vercel logs: `vercel logs`

### ❌ "CORS policy: origin not allowed"
**Cause:** Frontend domain not in CORS allowlist
**Fix:** Add your frontend domain to `backend/index.js` allowedOrigins

### ❌ Email not received
**Cause:** Invalid Gmail credentials or 2FA issues
**Fix:** Regenerate App Password, enable 2FA, check Vercel logs

### ❌ MongoDB connection error
**Cause:** Missing MONGO_URI in Vercel env vars
**Fix:** Add MONGO_URI to Vercel dashboard

---

## 📞 Quick Deployment Checklist

- [ ] Environment variables set in Vercel (MONGO_URI, EMAIL_USER, EMAIL_PASS)
- [ ] Root `vercel.json` exists (not duplicate in backend/)
- [ ] Frontend `script.js` has smart API_URL function
- [ ] Backend CORS allows your frontend domain
- [ ] Test form submission locally: `npm run dev`
- [ ] Deploy: `vercel --prod`
- [ ] Test form submission on live site
- [ ] Check email received

---

## 🔗 Useful Links

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Logs](https://vercel.com/docs/observability/runtime-logs)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Nodemailer Docs](https://nodemailer.com/)

---

## 📧 Alternative Email Services (Optional)

If Gmail doesn't work, try these:

### Option 1: Resend (Recommended for serverless)
```bash
npm install resend
```
Better for Vercel serverless, no 2FA issues.

### Option 2: SendGrid
Free tier: 100 emails/day

### Option 3: AWS SES
Most reliable, but needs AWS account setup.

---

**✅ Your portfolio should now work in production!**

Questions? Check Vercel logs: `vercel logs`
