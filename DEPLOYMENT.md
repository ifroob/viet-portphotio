# Deployment Guide: Railway + Vercel + MongoDB Atlas

This guide will help you deploy Brian's Photography Portfolio using Railway (backend), Vercel (frontend), and MongoDB Atlas (database).

## Prerequisites

1. **GitHub Account** - For code repository
2. **Railway Account** - Sign up at https://railway.app
3. **Vercel Account** - Sign up at https://vercel.com
4. **MongoDB Atlas Account** - Sign up at https://mongodb.com/atlas

## Step 1: Set Up MongoDB Atlas

### Create Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new account or sign in
3. Create a new project called "Portfolio"
4. Create a new cluster (select FREE tier)
5. Choose your preferred region
6. Wait for cluster creation (2-3 minutes)

### Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/portfolio_db` at the end before the query parameters

Example: `mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Railway

### Push Code to GitHub
1. Create a new repository on GitHub called "portfolio-backend"
2. Push your backend code to GitHub:
```bash
cd /app/portphotio/backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/portfolio-backend.git
git push -u origin main
```

### Deploy on Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your "portfolio-backend" repository
6. Railway will automatically detect it's a Python project

### Configure Environment Variables
1. Go to your Railway project dashboard
2. Click on the "Variables" tab
3. Add these environment variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DB_NAME`: `portfolio_db`
   - `PORT`: `8000`

### Get Your Railway URL
1. Go to your Railway project dashboard
2. Click on "Settings"
3. Copy the "Public URL" (e.g., `https://your-app-name.railway.app`)
4. Save this URL - you'll need it for the frontend

### Initialize Sample Data
1. Wait for deployment to complete
2. Visit: `https://your-railway-app.railway.app/health`
3. If healthy, visit: `https://your-railway-app.railway.app/api/init-sample-data`
4. This will populate your database with sample photos and articles

## Step 3: Deploy Frontend to Vercel

### Update Environment Variables
1. Edit `/app/portphotio/frontend/.env.production`
2. Replace `https://your-railway-app.railway.app` with your actual Railway URL

### Push Code to GitHub
1. Create a new repository on GitHub called "portfolio-frontend"
2. Push your frontend code to GitHub:
```bash
cd /app/portphotio/frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/portfolio-frontend.git
git push -u origin main
```

### Deploy on Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your "portfolio-frontend" repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Install Command**: `yarn install`

### Configure Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add:
   - `REACT_APP_BACKEND_URL`: Your Railway backend URL
   - `GENERATE_SOURCEMAP`: `false`

### Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Get your Vercel URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update CORS Configuration

### Update Backend CORS
1. Edit your Railway backend code
2. Update the CORS origins in `server.py`:
```python
allow_origins=[
    "http://localhost:3000",  # Local development
    "https://localhost:3000",  # Local development
    "https://your-app.vercel.app",  # Your actual Vercel URL
    "https://*.vercel.app",    # All Vercel deployments
    "https://your-domain.com", # Your custom domain (if any)
],
```
3. Commit and push changes to trigger new deployment

## Step 5: Test Your Deployment

### Test Backend
1. Visit: `https://your-railway-app.railway.app/health`
2. Should return: `{"status": "healthy", "database": "connected"}`
3. Visit: `https://your-railway-app.railway.app/api/photos`
4. Should return JSON array of photos

### Test Frontend
1. Visit your Vercel URL
2. Navigate through all sections:
   - Portfolio
   - Blog
   - More Photos
   - Recipe Tweaker
3. Test commenting functionality
4. Check that all images load properly

## Step 6: Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### For Backend (Railway)
1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update frontend environment variables

## Troubleshooting

### Common Issues

#### Backend Issues
- **500 Error**: Check MongoDB connection string
- **CORS Error**: Update allowed origins in server.py
- **Database Connection**: Verify MongoDB Atlas IP whitelist

#### Frontend Issues
- **API Calls Failing**: Check REACT_APP_BACKEND_URL
- **Build Errors**: Verify all dependencies are installed
- **Routing Issues**: Check vercel.json configuration

### Debug Steps
1. Check Railway logs for backend errors
2. Check Vercel function logs for frontend errors
3. Use browser developer tools to check network requests
4. Verify environment variables are set correctly

## Estimated Costs

- **Railway**: Free tier ($5/month credit, usually sufficient)
- **Vercel**: Completely free
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month with free tiers

## Performance Optimization

### Backend (Railway)
- Uses async/await for all database operations
- Implements proper error handling
- Health checks for monitoring

### Frontend (Vercel)
- Optimized build process
- CDN delivery
- Automatic optimization

### Database (MongoDB Atlas)
- Indexed queries for better performance
- Connection pooling
- Automatic backups

## Security Features

- CORS properly configured
- Environment variables for sensitive data
- HTTPS everywhere
- Input validation on all endpoints

## Monitoring

### Railway
- Built-in logging and metrics
- Automatic restarts on failure
- Health check endpoints

### Vercel
- Analytics dashboard
- Function logs
- Performance insights

### MongoDB Atlas
- Performance monitoring
- Security alerts
- Backup status

## Next Steps

1. **Custom Domain**: Set up your own domain
2. **Analytics**: Add Google Analytics or similar
3. **SEO**: Optimize meta tags and sitemap
4. **Performance**: Add image optimization
5. **Monitoring**: Set up uptime monitoring

## Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

Happy deploying! 🚀