# Scene Match Frontend

This is the frontend of the SceneMatch project. It is a web application that allows users to specify what kind of movies they like and then finds movies that match their preferences. The application is built using Angular and is hosted on a server.

It has the following features:

- User registration and login: Users can create an account and log in to the application using a username and password. Auto logs in the user if they have a valid jwt token in their local storage.
- User profile page: Users can view their profile information, including their username, email, and a list of their favorite genres and keywords. 
- Movies page: Users can view a list of movies that are available in the database.
- Recommendation page: Users can view a list of movies that match their preferences. The recommendation page uses a recommendation algorithm to suggest movies based on the user's liked genres and keywords.

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
