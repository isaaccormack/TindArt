# Majabris! (README for M3)

## Members
- Braydon Berthelet -> #36436933
- Isaac Cormack -> #28799896
- Jamie St Martin -> #3781898
- Marina Dunn -> #26510100

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
 

