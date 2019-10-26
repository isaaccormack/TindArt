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
  

## Contributing
This app uses [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching. 
To contribute:
1. Clone the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature'). If you don't want the CI pipeline to be re-run on your commit (for example, if you've only changed the docs), then add [skip ci] somewhere in the commit message.
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
