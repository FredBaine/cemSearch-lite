# Firebase Deployment Script
# This script safely builds and deploys the app to Firebase hosting
# Make sure to set your environment variables before running this script

# For CI/CD, you can set these as secrets/environment variables:
# FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.

Write-Host "Building Angular app for production..." -ForegroundColor Green

# Build the app
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Deploying to Firebase..." -ForegroundColor Green
    
    # Deploy to Firebase
    npx firebase deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}