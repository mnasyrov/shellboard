import fs from 'fs';
import {AppEnvironment} from './common/appEnvironment';
import {ShellBoardConfig} from './common/shellBoardConfig';
import {DEFAULT_CONFIG_FILE_PATH, DEFAULT_HTTP_LOG_FORMAT, DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT} from './constants';
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
    const configFilePath = env.SHELLBOARD_CONFIG || DEFAULT_CONFIG_FILE_PATH;
    const serverHost = env.SERVER_HOST || DEFAULT_SERVER_HOST;

    const serverPort = env.SERVER_PORT ? parseInt(env.SERVER_PORT, 10) : DEFAULT_SERVER_PORT;
    if (isNaN(serverPort)) {
        return {validationError: 'Environment error: SERVER_PORT is not valid.'};
    }

    const httpLogFormat = env.HTTP_LOG_FORMAT || DEFAULT_HTTP_LOG_FORMAT;

    let basicAuth;
    if (env.BASIC_AUTH) {
        const [username, password] = env.BASIC_AUTH.split(':', 2);
        if (!username || !password) {
            return {validationError: 'Environment error: BASIC_AUTH has incorrect format.'};
        }
        basicAuth = {username, password};
    }

    return {
        env: {
            serverHost,
            serverPort,
            configFilePath,
            httpLogFormat,
            basicAuth
        }
    };
}
