import dotenv from 'dotenv';
import {RequestHandler} from 'express';
import passport from 'passport';
import {createApiRouter} from './api/apiRouter';
import {createCommandsRouter} from './api/commands/commandsRouter';
import {createApplication} from './app';
import {createAuthFilter, createBasicAuthStrategy} from './auth';
import {ShellBoardConfig} from './common/shellBoardConfig';
import {APP_NAME} from './constants';
import {ShellExecutor} from './shell/shellExecutor';
import {DummyStorage} from './storages/dummyStorage';
import {parseEnvironmentVariables, readShellConfigFile} from './utils';

dotenv.config();
start();

async function start() {
    // Get the app configuration
    const {env, validationError} = parseEnvironmentVariables(process.env);
    if (!env) {
        console.error(validationError);
        return process.exit(1);
    }

    // Read configuration of shell scripts
    let shellBoardConfig: ShellBoardConfig;
    try {
        shellBoardConfig = await readShellConfigFile(env.configFilePath);
    } catch (error) {
        console.error(`Failed to read or parse a config file: ${error}`);
        return process.exit(1);
    }
    console.log(`Loaded the config file: ${env.configFilePath}`);

    // Initialize components
    let authFilter: RequestHandler | undefined;
    if (env.basicAuth) {
        const authStrategy = createBasicAuthStrategy(env.basicAuth.username, env.basicAuth.password);
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
        httpLogFormat: env.httpLogFormat
    });

    // Start the server
    app.listen(env.serverPort, env.serverHost, () => {
        const mode = app.get('env');
        console.log(`${APP_NAME} is running at http://${env.serverHost}:${env.serverPort} in ${mode} mode...`);
        console.log('Press CTRL-C to stop');
    });
}
