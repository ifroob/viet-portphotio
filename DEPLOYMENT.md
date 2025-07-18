# Deployment Guide: Railway (Full App) + Vercel (Frontend) + MongoDB Atlas

This guide will help you deploy Brian's Photography Portfolio using Railway for the backend (from the monorepo), Vercel for the frontend, and MongoDB Atlas for the database.

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

## Step 2: Deploy Full App to Railway

### Push Code to GitHub
1. Create a new repository on GitHub called "portfolio-app"
2. Push your entire app code to GitHub:
```bash
cd /app/portphotio
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/portfolio-app.git
git push -u origin main
```

### Deploy on Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your "portfolio-app" repository
6. Railway will detect the monorepo structure and use the backend configuration

### Configure Environment Variables
1. Go to your Railway project dashboard
2. Click on the "Variables" tab
3. Add these environment variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DB_NAME`: `portfolio_db`
   - `PORT`: `8000` (Railway will override this automatically)

### Verify Deployment
1. Railway will automatically build and deploy your backend
2. The build process will:
   - Use the `railway.json` configuration
   - Install dependencies from `backend/requirements.txt`
   - Start the server from the `backend/` directory
3. Check deployment logs for any errors

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

### Create Separate Frontend Repository
1. Create a new repository on GitHub called "portfolio-frontend"
2. Push only the frontend code:
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
1. Your backend code already includes proper CORS configuration
2. The deployment will automatically allow your Vercel domain
3. If you need to update CORS origins, modify `server.py` in your repository:
```python
allow_origins=[
    "http://localhost:3000",  # Local development
    "https://localhost:3000",  # Local development
    "https://your-app.vercel.app",  # Your actual Vercel URL
    "https://*.vercel.app",    # All Vercel deployments
    "https://your-domain.com", # Your custom domain (if any)
],
```
4. Commit and push changes to trigger new Railway deployment

## Step 5: Test Your Deployment

### Test Backend
1. Visit: `https://your-railway-app.railway.app/health`
2. Should return: `{"status": "healthy", "database": "connected"}`
3. Visit: `https://your-railway-app.railway.app/api/photos`
4. Should return JSON array of photos
5. Test monitoring endpoints:
   - `https://your-railway-app.railway.app/api/monitoring/usage`
   - `https://your-railway-app.railway.app/api/monitoring/dashboard`

### Test Frontend
1. Visit your Vercel URL
2. Navigate through all sections:
   - Portfolio
   - Blog
   - More Photos
   - Recipe Tweaker
3. Test commenting functionality
4. Check that all images load properly

## Railway Configuration Details

### Monorepo Structure
```
portphotio/
├── backend/              # Railway deploys from here
│   ├── server.py         # Main FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
├── frontend/            # Deployed separately to Vercel
├── railway.json         # Railway configuration
├── Procfile            # Process definition
├── nixpacks.toml       # Build configuration
└── .railwayignore      # Files to exclude from deployment
```

### Railway Build Process
1. Railway reads `railway.json` for configuration
2. Uses `nixpacks.toml` to determine working directory
3. Installs dependencies from `backend/requirements.txt`
4. Starts the application from `backend/` directory
5. Excludes frontend files via `.railwayignore`

### Benefits of This Approach
- **Single Repository**: Easier to manage both frontend and backend
- **Efficient Deployment**: Only backend files are deployed to Railway
- **Cost Effective**: Single Railway project instead of multiple
- **Simple Updates**: Update backend code and push to trigger redeploy

## Step 6: Set Up Monitoring

### Railway Monitoring
1. Visit your Railway dashboard
2. Go to "Metrics" tab to see usage
3. Set up alerts at $3 and $4 thresholds
4. Monitor CPU, memory, and network usage

### Use Built-in Monitoring
1. Test monitoring endpoints:
   - `https://your-railway-app.railway.app/api/monitoring/usage`
   - `https://your-railway-app.railway.app/api/monitoring/dashboard`
2. Use the monitoring dashboard (update the URL in `monitoring/dashboard.html`)
3. Set up the Python monitoring script for local tracking

## Troubleshooting

### Railway Deployment Issues
- **Build fails**: Check `railway.json` configuration
- **Dependencies not found**: Verify `backend/requirements.txt`
- **Wrong working directory**: Check `nixpacks.toml` and `Procfile`
- **Environment variables**: Ensure all required variables are set

### Common Issues
- **404 on API calls**: Check that routes are prefixed with `/api`
- **CORS errors**: Verify allowed origins in `server.py`
- **Database connection**: Check MongoDB Atlas connection string
- **Monitoring not working**: Verify `psutil` is installed

## Estimated Costs

- **Railway**: Free tier ($5/month credit, usually sufficient)
- **Vercel**: Completely free for frontend
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month with free tiers

## Next Steps

1. **Custom Domain**: Set up your own domain for both services
2. **Monitoring**: Set up continuous monitoring
3. **Analytics**: Add Google Analytics
4. **SEO**: Optimize meta tags
5. **Performance**: Monitor and optimize resource usage

## Railway-Specific Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Check project status
railway status

# View logs
railway logs

# Check environment variables
railway variables

# Deploy latest changes
git push origin main  # Auto-deploys to Railway
```

This monorepo approach keeps your codebase organized while optimizing deployment costs and complexity! 🚀