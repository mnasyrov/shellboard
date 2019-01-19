import dotenv from 'dotenv';
import {RequestHandler} from 'express';
import passport from 'passport';
import {createApiRouter} from './api/apiRouter';
import {createCommandsRouter} from './api/commands/commandsRouter';
import {createApplication} from './app';
import {createAuthFilter, createBasicAuthStrategy} from './auth';
import {ShellBoardConfig} from './common/shellBoardConfig';
import {APP_NAME, PUBLIC_DIR} from './constants';
import {ShellExecutor} from './shell/shellExecutor';
import {DummyStorage} from './storages/dummyStorage';
import {parseEnvironmentVariables, readShellConfigFile} from './utils';

dotenv.config();
start();

function start() {
    // Get the app configuration
    const {env, envValidationError} = parseEnvironmentVariables(process.env);
    if (!env) {
        console.error(envValidationError);
        return process.exit(1);
    }

    // Read configuration of shell scripts
    let shellBoardConfig: ShellBoardConfig;
    try {
        shellBoardConfig = readShellConfigFile(env.configFilePath);
    } catch (error) {
        console.error(`Failed to read or parse a config file: ${error}`);
        return process.exit(1);
    }
    console.log(`Loaded the config file: ${env.configFilePath}`);

    // Initialize components
    let authFilter: RequestHandler | undefined;
    if (env.basicAuthUsername && env.basicAuthPassword) {
        const authStrategy = createBasicAuthStrategy(env.basicAuthUsername, env.basicAuthPassword);
        passport.use(authStrategy);
        authFilter = createAuthFilter();
    }

    const shellExecutor = new ShellExecutor();
    const storage = new DummyStorage(shellBoardConfig.commands);
    const commandsRouter = createCommandsRouter(storage, shellExecutor);
    const apiRouter = createApiRouter(commandsRouter);

    const app = createApplication({
        authFilter,
        apiRouter,
        publicDir: PUBLIC_DIR
    });

    // Start the server
    app.listen(env.port, env.hostname, () => {
        const mode = app.get('env');
        console.log(`${APP_NAME} is running at http://${env.hostname}:${env.port} in ${mode} mode...`);
        console.log('Press CTRL-C to stop');
    });
}
