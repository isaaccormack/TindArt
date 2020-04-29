# TindArt!

[![Build Status](https://travis-ci.com/seng350/seng350f19-project-team-3-1.svg?token=MKYirfVTx6By2GhqMnsq&branch=develop)](https://travis-ci.com/seng350/seng350f19-project-team-3-1)
[![codecov](https://codecov.io/gh/seng350/seng350f19-project-team-3-1/branch/develop/graph/badge.svg?token=nysinaCFt7)](https://codecov.io/gh/seng350/seng350f19-project-team-3-1)
## Getting Started 
1. Install and run MongoDB on your local computer. Mongo should be listening on port 27017.
2. Open a session with mongo
```
mongo
```
3. Create and use a new database "myapp"
```
use myapp
```
4. Create a collection "users" in the "myapp" database
```
db.createCollection("users")
```
5. Make both the "email" and "username" fields in the "users" collection unique
```
db.users.createIndex( { "email": 1 }, { unique: true } )
db.users.createIndex( { "username": 1 }, { "unique": true } )
```
6. Clone the repo
```sh
git clone https://github.com/isaaccormack/TindArt.git
```
7. Install NPM packages
```sh
npm install
```
8. Compile the Typescript
```sh
npm run build-ts
```
or Compile using Watch Mode:
```sh
npm run watch-ts
```
9. Start the application
```sh
npm start
```
9. Navigate to the site on http://localhost:3000/

## Getting Started (with Docker)
1. Clone the repo
```sh
git clone https://github.com/isaaccormack/TindArt.git
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

## Developing
For ease of development, running the below is recommended.

The TypeScript transpiler on watch mode to transpile TypeScript source code into JavaScript on every save:
```
npm run watch-ts
```

And, in a new terminal window, a 'nodemon' to refresh the server when new JavaScript is generated (using an npm script):

```
npm run dev
```

## Linting & Testing
To lint:
```
npm run lint
```
To run unit and intergration tests (integration tests require a mongodb instance to be running on `localhost:27017`):
```
npm run test
```

## Contributing
This app uses [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching. 
To contribute:
1. Clone the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature'). If you don't want the CI pipeline to be re-run on your commit (for example, if you've only changed the docs), then add [skip ci] somewhere in the commit message.
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
