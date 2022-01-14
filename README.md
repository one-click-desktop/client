# OneClickDesktop Client

Client application for OneClickDesktop project. Allows user to login, request session and connect to it.

Created using Angular + Electron.

User configuration is loaded and stored in `config.json` file, which should be distributed along with app.

> ⚠️ Application will not start if configuration file is missing or incorrect. Since it stores path to API, without it user will be locked to login screen unable to login.

## Requirements

- [Node.js](https://nodejs.org/en/)

## Usage

To start using simply launch the executable file, while configuration file is stored next to it.

After logging in, you can modify configuration or start using the system.
If there are any machines available, you can connect to one of selected type, and after your session is ready, RDP session with provided machine will start.

> For Windows preinstalled Microsoft RDP client is used, for Linux - `xfreerdp` is required.

## Configuration file

Configuration file contains:

- Server address (`basePath`) - URI path to server.

- Broker address (`rabbitPath`) - URI path to RabbitMQ instance for handling external connections.

- Using login credentials for RDP (`useRdpCredentials`) - specifies if credentials used for login should be used for RDP connection.

- Start RDP connection on session ready (`startRdp`) - specifies if app should automatically start RDP connection using platform specific client. If disabled address target machine will be displayed and user must connect on their own.

## Development

First run `npm install` to install all required packages.

Run:

- `npm run ng:serve` to start application in web mode on `http://localhost:4200/`.

- `npm run electron:serve` to serve app in electron. Opens new electron window.

  > ⚠️ To prevent **CORS** errors **webSecurity** is disabled in serve mode.

- `npm run start` to run both above, where you can view app both through browser and electron app.

## Build

Run:

- `npm run build:dev` or `npm run build:prod` to build angular app to `\dist` directory.

- `npm run electron:dev` or `npm run electron:prod` to build angular app and start electron app in specified configuration.

- `npm run electron:build` will build whole application and place executable file (and configuration file) in `release/` along with archive containing executable with configuration. Rest of files are temporary files from electron build. On defaults pushes to repo specified in `package.json`. Requires environmental variable `GH_TOKEN` to be set to valid github token.

## Release

Running `npm run release` will do the same as last point of build, but will also publish the finished artifacts.

## Running unit tests

Run `npm run test` to execute the unit tests via Jest. `npm run test:watch` and `npm run test:coverage` to run test with watch and coverage flags respectively.

## Running end-to-end tests

Run `npm run cy:open` to open Cypress application for E2E tests. This allows to easily overseer and debug E2E tests.
Run `npm run ng:e2e` to start CLI-only tests.
