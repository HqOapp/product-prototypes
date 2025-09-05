#!/bin/bash

# HqO CRM Prototype Startup Script
# This script starts the HqO CRM prototype on port 3001

echo "🚀 Starting HqO CRM Prototype on port 3001..."
echo "📍 Make sure you're in the hqo-crm directory"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the hqo-crm directory."
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo ""
fi

# Start the development server
echo "🎯 Starting development server..."
echo "🌐 The prototype will be available at: http://localhost:3001"
echo "🔗 Click the HqO CRM card in the main dashboard to open this prototype"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
