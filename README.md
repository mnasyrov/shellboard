# ShellBoard

[![npm version](https://badge.fury.io/js/shellboard.svg)](https://www.npmjs.com/shellboard)
[![build Status](https://travis-ci.org/mnasyrov/shellboard.svg?branch=master)](https://travis-ci.org/mnasyrov/shellboard)


## What is it?

ShellBoard is a tiny web server which provides REST API to execute shell commands. The commands are configured statically and not editable outside. 


## Why?

Sometimes it is need to have an ad-hoc web server:

* for monitoring a system state by shell commands;
* for triggering system actions during development or integration testing.

ShellBoard covers urgent needs to automate some actions by triggering HTTP API.


## Features

* Simple configuration;
* Simple REST API;
* Optional Basic Authentication for API requests.


## Usage

**Disclaimer:** By default, ShellBoard listen requests only from `localhost`. It is a responsibility of a server administrator to configure the tool properly and use it securely.

### Quick start

Create `shellboard.json` file in a current directory:

```json
{
  "commands": [
    "echo Hello World!",
    "date"
  ]
}
```

Start the server:

```bash
npx shellboard
# or: yarn shellboard
# or: node node_modules/.bin/shellboard
```

Trigger API endpoints:

```bash
# List commands
curl http://localhost:3000/api/commands
{"commands":["echo Hello World!","date"]}

# Execute a command
curl -X POST http://localhost:3000/api/commands/0
{"command":"echo Hello World!","exitStatus":0,"stdout":"Hello World!\n","stderr":""}

curl -X POST http://localhost:3000/api/commands/1
{"command":"date","exitStatus":0,"stdout":"Sat Jan 19 21:56:30 +07 2019\n","stderr":""}
```

### Installation

ShellBoard can be installed as a global tool:

```bash
npm install --global shellboard
```

As a development dependency of a project:

```bash
npm install --save-dev --save-exact shellboard
# or:  yarn add --dev --exact shellboard
```

ShellBoard can be run without intallation using `npx` command of `npm`:

```bash
npx shellboard
```

### Configuration

ShellBoard is configured by environment variables and a configuration file.

#### Environment variables

The tool uses [dotenv](https://www.npmjs.com/package/dotenv) library to optionally load environment variables from `.env` file in a current working directory. See [.env.defaults](.env.defaults) file as an example.

Variables and default values:

* `SHELLBOARD_CONFIG` – default value: `shellboard.json`
  A file path to a configuration file, by default the file is searched in working directory.
*  `SERVER_HOSTNAME` – default value: `localhost`.
  The server uses it to listen API request. To listen external requests using all network interfaces set it to `0.0.0.0`.
* `SERVER_PORT` – default value: `3000`
  Specifies a server port to listen API requests.
* `HTTP_LOG_FORMAT` – default value: `common`.
  Defines format to log HTTP requests. Available valies: `combined`, `common`, `dev`, `short`, `tiny`. Check documentation of [morgan](https://github.com/expressjs/morgan) library to define custom formats.
* `BASIC_AUTH_USERNAME` – optional value. 
* `BASIC_AUTH_PASSWORD` – optional value.

`BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` enables Basic Authentication for API endpoints. The both variables must be defined to work.

#### Configuration file

By default ShellBoard searches for `shellboard.json` file in a current working directory. File path can be changed by `SHELLBOARD_CONFIG` environment variable.

This file declares an array of shell commands which will be available via API.

```json
{
  "commands": [
    "ls",
    "free -h",
    "df -u ."
  ]
}
```

See [shellboard-example.json](shellboard-example.json) as an example.


## REST API

### `GET /api/commands`
Returns a list of availabled commands.

Response:
```json
{
  "commands": [
    "echo Hello World!",
    "date"
  ]
}
```

### `GET /api/commands/:index` 
Returns details about a command specified by an index of `commands` list.

Response:
```json
{
  "command": "echo Hello World!"
}
```

### `POST /api/commands/:index` 
Executes a command specified by an index of `commands` list.

Response:

```json
{
  "command": "echo Hello World!",
  "exitStatus": 0,
  "stdout": "Hello World!\n", 
  "stderr": ""
}
```


## Development

[Yarn](https://yarnpkg.com) is used as package and build manager.

Development scripts:
* `yarn start` – runs a development server in watching mode.
* `yarn lint` – checks source code by static analysis tools.
* `yarn test` – runs unit tests.
* `yarn check-format` – check formats of source code.
* `yarn format` – formats source code by [prettier](https://prettier.io/) tool.
* `yarn check-commit` – runs all nesessary checks, tests and builds to ensure the commit will be green.

Build scripts: 
* `yarn build` – compiles sources.
* `yarn dist` – makes an app bundle in `/dist` directory.

Publish to NPM (for maintainers):

```bash
yarn check-commit
yarn clean && yarn dist-build
yarn check-publish
npm run do-publish --otp=<CODE>
```

## License

[MIT](LICENSE)
