import fs from 'fs';
import {AppEnvironment} from './common/appEnvironment';
import {ShellBoardConfig} from './common/shellBoardConfig';
import {DEFAULT_CONFIG_FILE_PATH, DEFAULT_HOSTNAME, DEFAULT_PORT} from './constants';
import ProcessEnv = NodeJS.ProcessEnv;

export function readShellConfigFile(filePath: string): ShellBoardConfig {
    const buffer = fs.readFileSync(filePath);
    const text = buffer.toString('utf8');
    const {commands} = JSON.parse(text);
    return {
        commands: commands || []
    };
}

export function parseEnvironmentVariables(
    env: ProcessEnv
): {
    env?: AppEnvironment;
    envValidationError?: string;
} {
    const hostname = env.SERVER_HOSTNAME || DEFAULT_HOSTNAME;
    const port = env.SERVER_PORT ? parseInt(env.SERVER_PORT, 10) : DEFAULT_PORT;
    const configFilePath = env.SHELLBOARD_CONFIG || DEFAULT_CONFIG_FILE_PATH;
    const basicAuthUsername = env.BASIC_AUTH_USERNAME;
    const basicAuthPassword = env.BASIC_AUTH_PASSWORD;

    if (!basicAuthUsername && basicAuthPassword) {
        return {envValidationError: 'Environment error: BASIC_AUTH_USERNAME is not set.'};
    }
    if (basicAuthUsername && !basicAuthPassword) {
        return {envValidationError: 'Environment error: BASIC_AUTH_PASSWORD is not set.'};
    }

    return {env: {hostname, port, configFilePath, basicAuthUsername, basicAuthPassword}};
}
