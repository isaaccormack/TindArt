<p align="center">
    <img src="https://github.com/isaaccormack/TindArt/blob/develop/public/assets/tindart-logo.png" height="130">
</p>

<p align="center">
    <img src="https://img.shields.io/github/package-json/v/seng350/seng350f19-project-team-3-1?style=flat-square" />
    <img src="https://img.shields.io/david/seng350/seng350f19-project-team-3-1?style=flat-square" />
    <img src="https://img.shields.io/github/contributors/seng350/seng350f19-project-team-3-1?style=flat-square" />
    <img src="https://img.shields.io/github/issues-raw/seng350/seng350f19-project-team-3-1?style=flat-square" />
    <img src="https://codecov.io/gh/seng350/seng350f19-project-team-3-1/branch/master/graph/badge.svg?token=nysinaCFt7" />
</p>

<h1 align="center">Tinder, but for Art</h1>
TindArt is a simple web app connecting artists and art enthusiasts in close proxmity using a tinder-esque matching style. 

## Getting Started 
This app requires node v12.0 or higher.

1. Install and run MongoDB on your local machine. Mongo should be listening on port 27017.
2. Clone the repo
```sh
git clone https://github.com/isaaccormack/TindArt.git
```
3. Install NPM packages
```sh
npm install
```
4. Compile the TypeScript
```sh
npm run build-ts
```
5. Start the application
```sh
npm start
```
6. Navigate to the site on http://localhost:3000/

## Running With Docker
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
For ease of development, running these two processes concurrently is recommended.

The TypeScript transpiler on watch mode, which transpiles TypeScript to JavaScript on every save
```
npm run watch-ts
```

and nodemon to refresh the server when new JavaScript is generated

```
npm run dev
```

## Linting & Testing
To lint
```
npm run lint
```
To run unit and intergration tests (integration tests require a mongodb instance to be running on `localhost:27017`)
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
