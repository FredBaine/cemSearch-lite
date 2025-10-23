# CemSearchLite

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Environment Setup

Before running the application, you need to set up your Firebase configuration:

1. Copy the environment template:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   ```

2. Edit `src/environments/environment.ts` and replace the placeholder values with your actual Firebase configuration:
   - Get your Firebase config from the Firebase Console > Project Settings > General > Your apps
   - Replace `YOUR_FIREBASE_API_KEY_HERE` with your actual API key
   - Replace other placeholder values with your project-specific values

3. **Important**: Never commit `src/environments/environment.ts` to Git as it contains sensitive API keys

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
