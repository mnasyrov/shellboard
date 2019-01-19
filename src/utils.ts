import fs from 'fs';
import {AppEnvironment} from './common/appEnvironment';
import {ShellBoardConfig} from './common/shellBoardConfig';
import {DEFAULT_CONFIG_FILE_PATH, DEFAULT_HOSTNAME, DEFAULT_HTTP_LOG_FORMAT, DEFAULT_PORT} from './constants';
import ProcessEnv = NodeJS.ProcessEnv;

export async function readShellConfigFile(filePath: string): Promise<ShellBoardConfig> {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            error ? reject(error) : resolve(data);
        });
    });
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
    validationError?: string;
} {
    const hostname = env.SERVER_HOSTNAME || DEFAULT_HOSTNAME;
    const port = env.SERVER_PORT ? parseInt(env.SERVER_PORT, 10) : DEFAULT_PORT;
    const configFilePath = env.SHELLBOARD_CONFIG || DEFAULT_CONFIG_FILE_PATH;
    const basicAuthUsername = env.BASIC_AUTH_USERNAME;
    const basicAuthPassword = env.BASIC_AUTH_PASSWORD;
    const httpLogFormat = env.HTTP_LOG_FORMAT || DEFAULT_HTTP_LOG_FORMAT;

    if (isNaN(port)) {
        return {validationError: 'Environment error: SERVER_PORT is not valid.'};
    }
    if (!basicAuthUsername && basicAuthPassword) {
        return {validationError: 'Environment error: BASIC_AUTH_USERNAME is missed.'};
    }
    if (basicAuthUsername && !basicAuthPassword) {
        return {validationError: 'Environment error: BASIC_AUTH_PASSWORD is missed.'};
    }

    return {env: {hostname, port, configFilePath, basicAuthUsername, basicAuthPassword, httpLogFormat}};
}
