#!/bin/bash
# Deploy Agent Service to Google Cloud Run
# Prerequisites: gcloud CLI installed and authenticated

PROJECT_ID="assigned-co-counsel"
SERVICE_NAME="acc-agent"
REGION="us-central1"

echo "Building and deploying ACC Agent Service to Cloud Run..."

# Build and deploy in one step
gcloud run deploy $SERVICE_NAME \
  --project $PROJECT_ID \
  --region $REGION \
  --source . \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 60 \
  --max-instances 3 \
  --min-instances 0 \
  --set-env-vars "API_SECRET=acc-agent-prod-$(openssl rand -hex 8)" \
  --port 8080

echo ""
echo "✅ Deployed! Now set the Cloud Run URL in your Firebase Functions .env:"
echo "   AGENT_SERVICE_URL=<your-cloud-run-url>"
echo "   AGENT_API_SECRET=<the-api-secret-from-above>"
