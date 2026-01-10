#!/bin/bash
set -e

# Configuration
SERVICE_NAME="portfolio-manager"
REGION="us-central1"

echo "🚀 Deploying to Cloud Run..."

# Ensure gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Get Project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No default project set. Please set one with: gcloud config set project [PROJECT_ID]"
    exit 1
fi
echo "Using Project ID: $PROJECT_ID"

# Enable APIs
echo "🔄 Enabling required APIs (Artifact Registry, Cloud Run, Cloud Build)..."
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com

# Create Artifact Registry Repo if it doesn't exist
REPO_NAME="portfolio-repo"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &> /dev/null; then
    echo "📦 Creating Artifact Registry repository..."
    gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Portfolio Manager Docker Repo"
else
    echo "✅ Repository $REPO_NAME exists."
fi

# Build and Push
IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME"
echo "🏗️ Building and pushing image to $IMAGE_URI..."
# Using gcloud builds submit is easier as it doesn't require local Docker
gcloud builds submit --tag $IMAGE_URI .

# Deploy
echo "🚀 Deploying service to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URI \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080

echo "✅ Deployment successful!"
echo "➡️  Service URL: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')"
