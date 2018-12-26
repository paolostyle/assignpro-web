# AssignPro

## About
**AssignPro** is a web application for solving various [assignment problems](https://en.wikipedia.org/wiki/Assignment_problem).
This project is part of my BSc thesis at Warsaw University of Technology.
This repo contains frontend part of the project.

## Technologies
### Front-end (TypeScript 3.2):
* VueJS 2.5 - JavaScript framework
* Bulma with SASS - CSS framework
* Vuex 3 - state management
* Buefy - components library
* Handsontable - data table for forms
* Firebase - history storage and synchronization
* Webpack 4 - bundler
* Vue CLI 3 - Webpack wrapper

## Running the app

### Development
You need node >=8.9 and preferably yarn (though it should work with npm, too):
```
yarn install
yarn start
```

### Production
You will need a server to serve the static files bundled by Webpack, e.g. `http-server`.
```
yarn build
```

## Copyright
Paweł Dąbrowski &copy; 2018
