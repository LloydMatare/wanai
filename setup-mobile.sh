#!/bin/bash
# Script to setup mobile app development environment

echo "Setting up Wanai mobile app..."

# Ensure we're in the project root
cd /home/kronos/Apps/wanai || exit 1

# Check if mobile app directory exists
if [ ! -d "apps/mobile" ]; then
  echo "Error: apps/mobile directory not found. Please run the setup first."
  exit 1
fi

# Install mobile dependencies
echo "Installing mobile dependencies..."
cd apps/mobile && npm install

# Copy Convex generated types to mobile
echo "Copying Convex generated types..."
mkdir -p apps/mobile/convex/_generated
cp -r convex/_generated/* apps/mobile/convex/_generated/

# Create mobile .env from example if it doesn't exist
if [ ! -f "apps/mobile/.env" ]; then
  echo "Creating mobile .env from example..."
  cp apps/mobile/.env.example apps/mobile/.env
  echo "Please edit apps/mobile/.env with your actual values:"
  echo "  - EXPO_PUBLIC_CONVEX_URL (from Convex dashboard)"
  echo "  - EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk dashboard)"
else
  echo "Mobile .env already exists."
fi

echo ""
echo "Setup complete! Next steps:"
echo "1. Edit apps/mobile/.env with your Convex and Clerk credentials"
echo "2. Start the Convex dev server in one terminal:"
echo "   npx convex dev"
echo "3. In another terminal, start the mobile dev server:"
echo "   cd apps/mobile && npx expo start"
echo ""
echo "For production builds, set EXPO_PUBLIC_CONVEX_URL to your deployed Convex URL"