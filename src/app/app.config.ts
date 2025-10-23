import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { routes } from './app.routes';

export const environment = {
  firebaseConfig: {
    apiKey: "AIzaSyAfn1PkPfzpgvDNOwNatPi3ry60Ss3g7FA",
    authDomain: "cem-search-2881f.firebaseapp.com",
    projectId: "cem-search-2881f",
    storageBucket: "cem-search-2881f.appspot.com",
    messagingSenderId: "618365417657",
    appId: "1:618365417657:web:1807ccadaacd4f3d0dc368",
    measurementId: "G-ZTV0ML9PER"
  },
  // Auto-detect: use emulators in dev mode, cloud in production
  useEmulators: isDevMode(),
  production: !isDevMode()
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators && isDevMode()) {
        console.log('Connecting to Firestore emulator...');
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
    ),
  ]
};