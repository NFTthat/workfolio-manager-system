#!/bin/bash

# Portfolio Management System Deployment Setup Script
# This script helps set up the environment for deployment

set -e

echo "🚀 Setting up Portfolio Management System for deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create database directory if it doesn't exist
echo "🗄️ Setting up database directory..."
mkdir -p db

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file from template..."
    cp .env.example .env
    echo "⚠️ Please update the .env file with your configuration before running the application"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build the application
echo "🏗️ Building the application..."
npm run build

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Run 'npm run db:push' to set up the database"
echo "3. Run 'npm run dev' to start the development server"
echo "4. For production, run 'npm start'"
echo ""
echo "🎉 Your Portfolio Management System is ready!"