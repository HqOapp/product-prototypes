#!/bin/bash

# Deploy Prototypes Script
# This script helps deploy individual prototypes to Vercel

echo "🚀 HqO Prototype Deployment Helper"
echo "=================================="

# Function to deploy a prototype
deploy_prototype() {
    local prototype_name=$1
    local prototype_path="prototypes/$prototype_name"
    
    if [ ! -d "$prototype_path" ]; then
        echo "❌ Prototype directory '$prototype_path' not found"
        return 1
    fi
    
    echo "📦 Deploying $prototype_name..."
    
    # Navigate to prototype directory
    cd "$prototype_path"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ No package.json found in $prototype_path"
        cd - > /dev/null
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install --legacy-peer-deps
    fi
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    npx vercel --prod
    
    # Go back to original directory
    cd - > /dev/null
    
    echo "✅ Deployment complete for $prototype_name"
    echo ""
}

# Main menu
echo "Available prototypes:"
echo "1. hqo-crm"
echo "2. Deploy all prototypes"
echo "3. Exit"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo "🎯 Deploying HqO CRM prototype..."
        deploy_prototype "hqo-crm"
        
        echo "📝 Next steps:"
        echo "1. Copy the deployed URL from Vercel output above"
        echo "2. In your main dashboard Vercel project, add environment variable:"
        echo "   NEXT_PUBLIC_HQO_CRM_URL=<your-deployed-url>"
        echo "3. Redeploy your main dashboard"
        ;;
    2)
        echo "🎯 Deploying all prototypes..."
        for prototype_dir in prototypes/*/; do
            if [ -d "$prototype_dir" ] && [ "$prototype_dir" != "prototypes/main-prototype/" ]; then
                prototype_name=$(basename "$prototype_dir")
                deploy_prototype "$prototype_name"
            fi
        done
        ;;
    3)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "📚 For more details, see DEPLOYMENT.md"
