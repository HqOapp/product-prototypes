# 🚀 Running Prototypes

This guide shows you how to run the main dashboard and individual prototypes simultaneously.

## 📊 Main Dashboard (Port 3000)

The main dashboard shows all your prototypes and runs on **port 3000**.

```bash
# In the root directory
npm run dev
```

Visit: **http://localhost:3000**

## 🏢 HqO CRM Prototype (Port 3001)

The HqO CRM prototype runs independently on **port 3001**.

### Option 1: Using the startup script
```bash
# Navigate to the HqO CRM directory
cd prototypes/hqo-crm

# Run the startup script
./start-prototype.sh
```

### Option 2: Manual start
```bash
# Navigate to the HqO CRM directory
cd prototypes/hqo-crm

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Start the prototype
npm run dev
```

Visit: **http://localhost:3001**

## 🎯 How It Works

1. **Start the main dashboard** on port 3000
2. **Start the HqO CRM prototype** on port 3001 (for embedding)
3. **Click the "View CRM Demo" button** on the HqO CRM card in the main dashboard
4. **The prototype opens in a new tab** at `/prototypes/hqo-crm` with the CRM embedded in an iframe

### 🔄 Route-Based Access

The prototypes are now accessible through clean routes:
- **Main Prototype**: `/prototypes/main-prototype`
- **HqO CRM**: `/prototypes/hqo-crm`
- **Future prototypes**: `/prototypes/{prototype-id}`

Each route provides:
- ✅ **Embedded prototype view** in an iframe
- ✅ **Fallback instructions** if the prototype isn't running
- ✅ **Navigation controls** to go back to dashboard or open in new tab
- ✅ **Loading states** and error handling

## 🔧 Troubleshooting

### Port Already in Use
If you get a "port already in use" error:

```bash
# Check what's using the port
lsof -ti:3001

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

### Dependencies Issues
If you encounter dependency conflicts:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📁 Adding New Prototypes

To add a new prototype:

1. **Create a folder** in `prototypes/`
2. **Add a `prototype.json`** file with metadata
3. **Set the `link` field** to your prototype route (e.g., `/prototypes/my-new-prototype`)
4. **Update the package.json** in your prototype to use a unique port
5. **The dashboard will automatically discover it**

Example prototype.json:
```json
{
  "name": "My New Prototype",
  "description": "Description of the prototype",
  "products": ["Product1", "Product2"],
  "status": "in-development",
  "type": "code",
  "author": "Your Name",
  "created": "2024-02-01",
  "updated": "2024-02-01",
  "tags": ["tag1", "tag2"],
  "link": "/prototypes/my-new-prototype",
  "repository": "https://github.com/your-repo",
  "screenshot": "screenshot.png",
  "priority": "medium",
  "callToAction": "View Prototype"
}
```

### 🎨 Route Structure

The prototype routes are automatically generated:
- **URL Pattern**: `/prototypes/{prototype-id}`
- **Prototype ID**: Matches the folder name in `prototypes/`
- **Route Features**:
  - Embedded iframe view of the prototype
  - Automatic fallback if prototype isn't running
  - Instructions for starting the prototype
  - Navigation back to dashboard
