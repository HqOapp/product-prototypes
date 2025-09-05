# 🚀 Deployment Guide

This guide explains how to deploy your prototype management system to production platforms like Vercel.

## 🎯 Current Issue

The route-based prototype system works perfectly in local development but requires additional setup for production deployment because:

- **Local**: Main dashboard (port 3000) + HqO CRM (port 3001) running separately
- **Production**: Everything needs to be accessible via HTTPS URLs

## 📋 Deployment Options

### Option 1: Separate Prototype Deployments ⭐ **Recommended**

Deploy each prototype as a separate Vercel project:

#### **Step 1: Deploy HqO CRM Separately**
```bash
# Deploy HqO CRM to its own Vercel project
cd prototypes/hqo-crm
npx vercel --prod

# Note the deployed URL (e.g., https://hqo-crm.vercel.app)
```

#### **Step 2: Configure Environment Variables**
In your main dashboard Vercel project, add environment variables:

```bash
# In Vercel dashboard > Settings > Environment Variables
NEXT_PUBLIC_HQO_CRM_URL=https://hqo-crm.vercel.app
```

#### **Step 3: Update Prototype Metadata**
```json
{
  "link": "/prototypes/hqo-crm",
  "deploymentUrl": "https://hqo-crm.vercel.app"
}
```

### Option 2: Monorepo with Subdirectories

Structure your deployment to include all prototypes:

```
project/
├── apps/
│   ├── dashboard/          # Main dashboard app
│   └── hqo-crm/           # HqO CRM prototype
└── vercel.json            # Multi-app configuration
```

**vercel.json:**
```json
{
  "builds": [
    { "src": "apps/dashboard/package.json", "use": "@vercel/next" },
    { "src": "apps/hqo-crm/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/crm/(.*)", "dest": "/apps/hqo-crm/$1" },
    { "src": "/(.*)", "dest": "/apps/dashboard/$1" }
  ]
}
```

### Option 3: Integrate into Main App

Move prototype pages directly into the main dashboard:

```
app/
├── page.tsx              # Dashboard
├── prototypes/
│   ├── [id]/
│   │   └── page.tsx     # Prototype wrapper
│   └── hqo-crm/        # Direct integration
│       ├── page.tsx
│       ├── leases/
│       ├── tenants/
│       └── ...
```

## 🛠 Quick Fix for Current Deployment

### Update Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Add environment variable: `NEXT_PUBLIC_HQO_CRM_URL=https://your-hqo-crm-deployment.vercel.app`

2. **Deploy HqO CRM separately:**
   ```bash
   cd prototypes/hqo-crm
   npx vercel --prod
   ```

3. **Update the environment variable** with the actual HqO CRM URL

### Temporary Workaround

If you want to test immediately, you can hardcode the URL:

```typescript
// In app/prototypes/[id]/page.tsx
case 'hqo-crm':
  prototypeUrl = 'https://your-actual-hqo-crm-url.vercel.app'
  break
```

## 🔄 Development vs Production

The current code automatically detects the environment:

- **Development** (`npm run dev`): Uses `localhost:3001`
- **Production** (Vercel): Uses environment variable or default URLs

## 📈 Recommended Workflow

1. **Develop locally** with separate ports
2. **Deploy prototypes individually** to Vercel
3. **Configure environment variables** in main dashboard
4. **Test production deployment** with real prototype URLs

## 🎯 Next Steps

1. Deploy HqO CRM to Vercel separately
2. Get the deployment URL
3. Add it as an environment variable to your main dashboard
4. Redeploy the main dashboard
5. Test the `/prototypes/hqo-crm` route

## 🔧 Alternative: Static Prototype Views

For prototypes that don't need to be fully interactive, you can create static views:

```typescript
// app/prototypes/hqo-crm/page.tsx
export default function HqOCRMPrototype() {
  return (
    <div className="prototype-container">
      {/* Static representation of your prototype */}
      <h1>HqO CRM</h1>
      <div className="demo-content">
        {/* Screenshots, descriptions, key features */}
      </div>
    </div>
  )
}
```

This approach works well for showcasing prototypes without the complexity of separate deployments.
