// Copy this file to environment.ts and fill in your actual Firebase configuration
// DO NOT commit the environment.ts file with real API keys to Git

export const environment = {
  production: false,
  useEmulators: true, // Set to false if you want to use the live Firebase in development
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};