# Majabris!

[![Build Status](https://travis-ci.com/seng350/seng350f19-project-team-3-1.svg?token=MKYirfVTx6By2GhqMnsq&branch=master)](https://travis-ci.com/seng350/seng350f19-project-team-3-1)
[![codecov](https://codecov.io/gh/seng350/seng350f19-project-team-3-1/branch/master/graph/badge.svg?token=nysinaCFt7)](https://codecov.io/gh/seng350/seng350f19-project-team-3-1)
## Getting Started
1. Clone the repo
```sh
git clone https://github.com/seng350/seng350f19-project-team-3-1.git
```
2. Run docker-compose (install it if necessary)
```sh
docker-compose up
```
3. Navigate to the site on http://localhost:3000/
4. Take down the site
```sh
docker-compose down
```

### Testing & Linting
From within the repo, run
```
npm run lint
```
to run the linter (which gives a small number of errors that we've opted to ignore), and
```
npm run test
```
to run the unit and integration tests. Our integration tests require a mongodb instance to be running on `localhost:27017`.

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


# Milestone 4

## User Stories Addressed
In this milestone user stories 3 through 6 were addressed.

User Story 3: Seller Updates Profile -> Support was added for a user to update their bio, phone number, add an avatar, and add photos to their account. The avatar and bio allows the seller to be recognizable to a potential buyer. This functionality works by adding a bio, phone number, avatar URL and list of photo URLs to the user object maintained in the database. 

User Story 4: Buyer Browsing Site -> Support for a user of the site to browse are which is for sale in the same location as them was added. This functionality works by quering the database for all photos which have the same location as the user and displaying them on the home page in a paginated fashion such that the user can navigate through them using and X or heart icon.

User Story 5: Buyer Likes Art -> Support for liking of photos was added by saving a users liked photos to their database object such that when a photo is like a request is sent to the server to add the photo id to this list.

User Story 6: Buyer Views Liked Art -> Support for viewing liked images was supported by adding an endpoint to recieve a list of users like photos. This endpoint queries the database for the user object and returns the list of all liked photos.

## Explanation of Automating CI/Testing of QAS from M1
Testability -> This QAS was automated by integrating testing into the continuous integration pipeline such that the unit tests were executed whenever commits were made to tracked branches. Along with this, code coverage is run to log the extent to which code coverage was changed by the recent commit.

Backend portability -> This QAS was automated by building docker images and deploying to dockerhub in the CI pipeline.

## Explanation of Testing and CI Pipeline
We unit test with mocha, chai, and ts-mockito. We run integration tests that use a mongodb instance to test the app more fully. We use nyc to measure code coverage. Testing is automated by travis-ci, which also deploys to dockerhub on a successful build.


# Milestone 3.5

## Functionality
In this milestone the following functionality was implemented:
1. A user page API was implemented allowing users of the application to view their own user page along with other users pages. This API works by parsing the requested unique username from the URL, the querying the database for data and photos owned by the account associated with that username. The server then renders this data onto the page, and sends back the URLs of the users photos which are hosted on a google cloud storage. The client side page uses a simple img tag with image source attribute to request the images from the given URLs.

On the user page, the ability of the authenticated user to update their bio and phone number was added. This used a simple POST endpoint on the server to first validate the users input, then update the field in the database with the respective value. The templating engine Mustache automatically escapes all user input to protect against persistant XSS attacks.

2. A database abstraction layer (DAL) was added in the server to seperate concerns between modules, increasing their cohesion. The DAL is a wrapper around database calls which provides a simple API that can be called to perform database operations. The DAL makes testing of the handlers easier as the calls to functions in the DAL can be stubbed. Overall, the DAL increases modulatiry and testability of the application.

3. The login and register handlers were made asynchronous using async/await. The asynchronous components of these handlers were abstracted into their own async functions to flatten the topography of the source code. 

4. A continuous database connection was implemented to improve response time of database queries.
  
5. A google storage server added to the applciation to host photos on. This server stores the photos based on their mongodb id value such that every url is unique. When photos are requested, a query to the database is made for the photo id's which are then returned to the client formatted into a url. From there the client renders the images using a simple img tag with the remote source.
  
6. A docker image for the application was created, and should the travis build pass when enough code coverage occurs, the docker image will be deployed on dockerhub.
  
7. Updates to the frontend for this milestone included that the entire home page design for the unauthorized individuals was redone. This was to progress towards a smaller goal of having a usable frontend. Additionally, the login and register pages were modified in keeping with the changes to the unauthorized frontend. Finally, changes to the aesthetic of the frontend for authorized users have been started as a header and a footer have been added to each of the pages. This increases the usability of th application.


## User Stories Addressed
In this milestone user stories 2 and 3 were addressed. User pages were implemented such that a user is able to update their bio and phone number, along with add photos to their account.

The upload photo endpoint was revised to upload photos to google cloud storage. The url for these photos are made unique by using their mongodb id in the url. The server then stores the images owner and id in the database. When a user page is loaded, a query is made to the photos collections in the database to return all photos with the user id of the user page's owner.

## Design Problems Faced
Implementing asynchronous server functions proved to be a larger job than initially expected, both in time and in complexity. The control flow of the routes of the application were difficult to define with a promise thenable chain, so async functions were used such that the function can return if a condition occurs in which it should not continue executing, yet an exception is not thrown (ie. no user found during log in).

The issue of moving data returned from database queries to the client in a uniform manner was solved this release. Data transfer objects (DTOs) were implemented for both the user and photo class such that a DTO is created with the data from a database query. A DTO provides a simple way to organize this data. Although the class definitions for DTOs and models look similar, it is important to note that they serve different purposes. Models are used for client data validation before inserting data into the database, where as DTOs are used to orchastrate the valid data returned from the database to provide a uniform interface for downstream consumers. An important distinction in implementation here is that a model has well defined methods for setting / getting internal members, and all internal members are private where as all members of DTO classes are public.

The architecture in place for this release aims to provide adequate seperation of concerns between server module such that there is good coupling in place between modules and each module has medium to high cohesion. It proved to be difficult to find the line of seperation between modules, are less modules makes for quicker development since less time is spent organizing a moving code around, but also hinders maintenance, as the modules are monolithic. Creating too many modules is cumbersome to develop with and unnecessary. The architecture in place now uses _routes_ to route user requests into _handlers_ (controllers), which implement business logic, making use of _models_ to validate user input before calling _services_ to interact with the database. The _handlers_ also utilize _DTOs_ to organize data returned from the _services_. Finally, the _routes_ render _views_ with the data returned from the handler in the form of _DTOs_ to display the content to the user.

The design has not notably changed since conception.


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
