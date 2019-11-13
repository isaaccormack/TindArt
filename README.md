# Majabris!

[![Build Status](https://travis-ci.com/seng350/seng350f19-project-team-3-1.svg?token=MKYirfVTx6By2GhqMnsq&branch=develop)](https://travis-ci.com/seng350/seng350f19-project-team-3-1)
[![codecov](https://codecov.io/gh/seng350/seng350f19-project-team-3-1/branch/master/graph/badge.svg?token=nysinaCFt7)](https://codecov.io/gh/seng350/seng350f19-project-team-3-1)
## Getting Started
1. Install and run MongoDB on your local computer. Mongo should be listening on port 27017.
2. Open a session with mongo
```
mongo
```
3. Create a new database "myapp" for this app
```
use myapp
```
4. Add a unique index on the email field in the users collection (such that every email in the collection is unique)
```
db.users.createIndex( { "email": 1 }, { unique: true } )
```
5. Clone the repo
```sh
git clone https://github.com/seng350/seng350f19-project-team-3-1.git
```
6. Install NPM packages
```sh
npm install
```
7. Compile the Typescript
```sh
npm run build-ts
```
or Compile using Watch Mode:
```sh
npm run watch-ts
```
8. Start the application
```sh
npm start
```
9. Navigate to the site on http://localhost:3000/

## Developing
For ease of development, using services which continuously reflect source code changes is recommended to be used. This can be accomplished by running two proccess continously during development:
1. Typescript transpiler on watch mode to transpile typescript source code into javascript on every save.
2. A 'nodemon' to watch the for changes in the javascript source code and automatically refresh the server to use this code.

To run this while developing, first start the transpiler on watch mode:
```
npm run watch-ts
```
Then, in a new window in your terminal, start the nodemon (an npm script is provided for convenience):
```
npm run dev
```

### Database Initialization
This app uses a mongoDB for persistant storage. To meet the business requirements of the application, the database must be properly initialized before use.
1. Install and start mongoDB on your local machine.
2. Open an interactive session with mongo be entering `mongo` in the shell
2. Create database "myapp" and use it as current databse: `use myapp`
3. Create a collection "users" in the "myapp" database: `db.createCollection("users")`
4. Make the "email" field in the "users" collection unique: `db.users.createIndex( { "email": 1 }, { "unique": true } )`
5. Make the "username" field in the "users" collection unique: `db.users.createIndex( { "username": 1 }, { "unique": true } )`

## Contributing
This app uses [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching. 
To contribute:
1. Clone the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature'). If you don't want the CI pipeline to be re-run on your commit (for example, if you've only changed the docs), then add [skip ci] somewhere in the commit message.
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

# Milestone 3

## Functionality
In this milestone the following functionality was implemented:
1. A register API where users are able to create new accounts. This register API takes a users name, email and password and performs server side validation of these fields before responding to the client whether or not information supplied was valid - and therefore an account was created - or a list of validation errors. If an account was created, the account name, email and a hashed and salted password (using bcrypt) is persisted in the database.
2. A login API where users are able to login to their existing accounts. This API takes a users email and password, first performing server-side validation on the data, handling errors appropriately, then querying the database for the email password combination. If it is found, the user is logged in, else an appropriate error message is sent back to the client.
3. Error handling route (404 handling). Not 100% complete but the idea is that there will be 404 middleware to return back a nice 404 page and also an error handler built into the middleware to catch errors which land at the end of the pipeline.

A Travis CI pipeline, static code analyser (TSlint), code coverage tool (nyc), and test suite (chai/mocha) were also added to the project for this milestone.

## User Stories Addressed
In this milestone, focus was put on creating solid foundational code is modular and (relatively) robust. As a result, functionality for this milestone in terms of overall user stories was limited.

From this milestone only user story #1, First Time User, was implemented. In this user story a user creates an account such that they are able to browse the (currently non-existant) art work.

## Design Problems Faced
The biggest design problem faced was architecting the software such that it maintained a seperation of concerns, meaning, each piece of code solves on problem and is non-overlapping with other section of code (ie. 2 section of code solve one problem). To solve this design problem we implemented a common route -> handler -> model -> database design pattern. In this design pattern, the route is used to map user requests to handlers. The handlers do the bulk of the work in servicing the request. The handler uses a model object (whos definition exists in the /src/models directory) to validate the user data if necessary. The handler then performs a database operation. For this milestone there is no direct seperation between the handler and the database, (ie. database operations are performed directly in handler), but for future milestones we are working to incorporate a database abstraction layer (DTA) which handles database operations such that the user of the DLA invokes a simple interface and recieves back an response or error. This will add testability to the handler and improve code distribution between different modules. 

The design has not notably changed since conception.
