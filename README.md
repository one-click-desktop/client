# OneClickDesktopClient

Client application for OneClickDesktop project. Allows user to login, request session and connect to it.

Created using Angular + Electron.

## Requirements

- [Node.js](https://nodejs.org/en/)

## Development

First run `npm install` to install all required packages.

Run:

- `npm run ng:serve` to start application in web mode on `http://localhost:4200/`.

- `npm run electron:serve` to serve app in electron. Opens new electron window.

  > ⚠️ To prevent **CORS** errors **webSecurity** is disabled in serve mode.

- `npm run start` to run both above, where you can view app both through browser and electron app.

- `npm run dev` or `npm run prod` to build and run application using only electron with dev or prod settings respectively.

## Build

Run:

- `npm run build:dev` or `npm run build:prod` to build angular app to `\dist` directory.

- `npm run electron:dev` or `npm run electron:prod` to build angular app and start electron app in specified configuration.

- `npm run electron:build` will build angular app in production mode and build electron app to publishable image.

## Running unit tests

Run `npm run test` to execute the unit tests via Jest. `npm run test:watch` and `npm run test:coverage` to run test with watch and coverage flags respectively.

## Running end-to-end tests

Run `npm run cy:open` to open Cypress application for E2E tests. This allows to easily overseer and debug E2E tests.
Run `npm run ng:e2e` to start CLI-only tests.
