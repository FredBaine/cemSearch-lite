# Production Deployment Guide

## Security Best Practices

Your Firebase API keys are now safely separated from your source code. Here's how to handle different deployment scenarios:

### Local Development
1. Copy `src/environments/environment.template.ts` to `src/environments/environment.ts`
2. Fill in your real Firebase configuration values
3. The `environment.ts` file is git-ignored and won't be committed

### Firebase Hosting Deployment

#### Option 1: Manual Deployment (Current Setup)
The production build uses `environment.prod.ts` which has placeholder values. For manual deployment:

1. Before deploying, manually update `src/environments/environment.prod.ts` with your real values
2. Run `npm run build` 
3. Run `npx firebase deploy`
4. **Important**: Don't commit the updated `environment.prod.ts` with real values

#### Option 2: CI/CD Pipeline (Recommended)
For automated deployments, use environment variable substitution:

1. **GitHub Actions Example:**
   ```yaml
   - name: Replace environment variables
     run: |
       sed -i 's/REPLACE_WITH_ACTUAL_API_KEY/${{ secrets.FIREBASE_API_KEY }}/g' src/environments/environment.prod.ts
       sed -i 's/REPLACE_WITH_ACTUAL_AUTH_DOMAIN/${{ secrets.FIREBASE_AUTH_DOMAIN }}/g' src/environments/environment.prod.ts
       # ... continue for other variables
   ```

2. **Set up GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add secrets for each Firebase config value:
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`
     - `FIREBASE_MEASUREMENT_ID`

#### Option 3: Build-time Environment Variables
Use a build script that reads from environment variables:

1. Install `dotenv`: `npm install --save-dev dotenv`
2. Create a build script that substitutes values at build time
3. Set environment variables in your deployment environment

### What's Safe to Commit Now

✅ **Safe to commit:**
- `src/environments/environment.template.ts` (template with placeholders)
- `src/environments/environment.prod.ts` (has placeholder values)
- `angular.json` (configured for file replacement)
- `.gitignore` (excludes sensitive files)

❌ **Never commit:**
- `src/environments/environment.ts` (contains real API keys)
- Any file with actual Firebase API keys

### Firebase Security Notes

Firebase API keys are not like traditional server API keys - they're designed to be included in client-side applications. However, it's still a best practice to:

1. Configure Firebase Security Rules properly
2. Set up App Check for additional security
3. Monitor usage in Firebase Console
4. Rotate keys periodically if needed

The main benefit of this setup is preventing accidental exposure and making it easier to manage different environments.