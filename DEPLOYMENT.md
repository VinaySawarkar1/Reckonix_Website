# Reckonix Deployment Guide for Render

## Prerequisites
- GitHub repository connected to Render
- MongoDB Atlas database (already configured)

## Deployment Steps

### 1. Connect Repository to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository: `https://github.com/VinaySawarkar1/Reckonix_Final_Website.git`
4. Render will automatically detect the `render.yaml` configuration

### 2. Environment Variables
Set these environment variables in Render dashboard:

#### Backend Service (reckonix-backend):
- `NODE_ENV`: production
- `MONGODB_URL`: Your MongoDB connection string
- `PORT`: 10000 (Render will override this)

#### Frontend Service (reckonix-frontend):
- `VITE_API_URL`: https://reckonix-backend.onrender.com

### 3. Build Configuration
The deployment will automatically:
- Install dependencies
- Build the backend TypeScript code
- Build the frontend React app
- Deploy both services

### 4. Service URLs
After deployment:
- Backend API: `https://reckonix-backend.onrender.com`
- Frontend: `https://reckonix-frontend.onrender.com`

### 5. Health Check
The backend includes a health check endpoint: `/api/products`

## File Structure for Deployment
```
├── render.yaml              # Render configuration
├── package.json             # Main dependencies and scripts
├── server/                  # Backend source code
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   └── tsconfig.json       # Server TypeScript config
├── client/                  # Frontend source code
│   ├── src/                # React components
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── uploads/                 # Product images (will be created)
```

## Troubleshooting

### Build Issues
- Check that all dependencies are in package.json
- Verify TypeScript compilation works locally

### Runtime Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure environment variables are set correctly

### Image Uploads
- The uploads directory will be created automatically
- Images will be stored in Render's ephemeral storage
- For production, consider using AWS S3 or similar for persistent storage
