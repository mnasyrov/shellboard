import {AppEnvironment} from './common/appEnvironment';
import {DEFAULT_CONFIG_FILE_PATH, DEFAULT_HTTP_LOG_FORMAT, DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT} from './constants';
import {parseEnvironmentVariables, readShellConfigFile} from './utils';

describe('function readShellConfigFile() #slow', () => {
    it('should read a configuration file', async () => {
        const file = 'shellboard-example.json';
        const config = await readShellConfigFile(file);
        expect(config).toBeDefined();
        expect(config.commands).toEqual(['ls', 'free -h', 'df -u .']);
    });

    it('should throw an error in case a file cannot be read', async () => {
        const file = '__not_existed_file__';
        await expect(readShellConfigFile(file)).rejects.toThrow();
    });

    it('should throw an error in case a file cannot be parsed', async () => {
        const file = 'README.md';
        await expect(readShellConfigFile(file)).rejects.toThrow();
    });
});

describe('function parseEnvironmentVariables()', () => {
    it('should return a default configuration from empty environment', () => {
        const result = parseEnvironmentVariables({});

        expect(result.validationError).toBeUndefined();
        expect(result.env).toBeDefined();

        const env: AppEnvironment = result.env as any;
        expect(env.serverHost).toEqual(DEFAULT_SERVER_HOST);
        expect(env.serverPort).toEqual(DEFAULT_SERVER_PORT);
        expect(env.configFilePath).toEqual(DEFAULT_CONFIG_FILE_PATH);
        expect(env.httpLogFormat).toEqual(DEFAULT_HTTP_LOG_FORMAT);
        expect(env.basicAuth).toBeUndefined();
    });

    it('should return read a configuration from an environment', () => {
        const result = parseEnvironmentVariables({
            SHELLBOARD_CONFIG: 'custom.json',
            SERVER_HOST: '1.2.3.4',
            SERVER_PORT: '1234',
            HTTP_LOG_FORMAT: 'custom-format',
            BASIC_AUTH: 'user:password'
        });

        expect(result.validationError).toBeUndefined();
        expect(result.env).toBeDefined();

        const env: AppEnvironment = result.env as any;
        expect(env.configFilePath).toEqual('custom.json');
        expect(env.serverHost).toEqual('1.2.3.4');
        expect(env.serverPort).toBe(1234);
        expect(env.httpLogFormat).toBe('custom-format');
        expect(env.basicAuth).toBeDefined();
        if (env.basicAuth) {
            expect(env.basicAuth.username).toEqual('user');
            expect(env.basicAuth.password).toEqual('password');
        }
    });

    it('should return a validation error in case Basic Auth has incorrect format', () => {
        const expectedMessage = 'BASIC_AUTH has incorrect format.';

        expect(parseEnvironmentVariables({BASIC_AUTH: 'user'}).validationError).toContain(expectedMessage);
        expect(parseEnvironmentVariables({BASIC_AUTH: 'user:'}).validationError).toContain(expectedMessage);
        expect(parseEnvironmentVariables({BASIC_AUTH: ':'}).validationError).toContain(expectedMessage);
        expect(parseEnvironmentVariables({BASIC_AUTH: ':password'}).validationError).toContain(expectedMessage);
    });

    it('should return a validation error in case SERVER_PORT cannot be parsed', () => {
        const result = parseEnvironmentVariables({SERVER_PORT: 'foo'});
        expect(result.validationError).toContain('SERVER_PORT is not valid');
    });
});
