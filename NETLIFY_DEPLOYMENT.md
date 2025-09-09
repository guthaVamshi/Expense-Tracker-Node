# 🚀 Netlify Deployment Guide for Expense Tracker API

## Prerequisites
1. GitHub account
2. Netlify account (free)
3. PostgreSQL database (recommend: Railway, Supabase, or Neon)

## 📝 Step-by-Step Deployment Instructions

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure for Netlify deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Netlify

#### Option A: Via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Branch to deploy:** main
   - **Build command:** `npm run build:netlify`
   - **Publish directory:** public
6. Click "Deploy site"

#### Option B: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 3. 🔧 Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

#### Required Database Variables:
```
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```

#### Optional Configuration:
```
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
PORT=8080
```

### 4. 🗄️ Database Setup Options

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project → PostgreSQL
4. Copy connection details to Netlify environment variables

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string and parse into individual variables

#### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection details

### 5. 🧪 Test Your Deployment

After deployment, your API will be available at:
```
https://your-site-name.netlify.app/api/
```

Test endpoints:
- `GET /api/` - Welcome message
- `GET /api/api-docs` - API documentation
- `POST /api/register` - User registration

### 6. 🔄 Automatic Deployments

Once connected to GitHub, Netlify will automatically:
- Deploy when you push to main branch
- Show build logs and status
- Provide preview deployments for pull requests

## 🎯 Common Issues & Solutions

### Issue 1: Function timeout
**Solution:** Netlify functions have a 10-second timeout limit. For long database operations, consider optimizing queries.

### Issue 2: Cold starts
**Solution:** First request after inactivity may be slow. This is normal for serverless functions.

### Issue 3: Database connection errors
**Solution:** 
- Check environment variables are correctly set
- Ensure database allows connections from external IPs
- Verify connection string format

### Issue 4: CORS errors
**Solution:** Set `CORS_ORIGIN` environment variable to your frontend domain

## 📊 Monitoring

Monitor your deployment:
- **Netlify Dashboard:** Build logs, function logs, analytics
- **Database:** Check your database provider's monitoring tools
- **Logs:** View function logs in Netlify Functions tab

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use environment variables for all secrets
3. ✅ Set appropriate CORS origins
4. ✅ Use HTTPS only (automatic with Netlify)
5. ✅ Regularly update dependencies

## 📱 Frontend Integration

Update your frontend to use the new API URL:
```javascript
const API_BASE_URL = 'https://your-site-name.netlify.app/api';
```

## 🎉 You're Live!

Your Expense Tracker API is now deployed and accessible worldwide! 🌍

For support, check:
- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
