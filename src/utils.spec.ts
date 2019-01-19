import {AppEnvironment} from './common/appEnvironment';
import {DEFAULT_CONFIG_FILE_PATH, DEFAULT_HOSTNAME, DEFAULT_HTTP_LOG_FORMAT, DEFAULT_PORT} from './constants';
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
        expect(env.hostname).toEqual(DEFAULT_HOSTNAME);
        expect(env.port).toEqual(DEFAULT_PORT);
        expect(env.configFilePath).toEqual(DEFAULT_CONFIG_FILE_PATH);
        expect(env.httpLogFormat).toEqual(DEFAULT_HTTP_LOG_FORMAT);
        expect(env.basicAuthUsername).toBeUndefined();
        expect(env.basicAuthPassword).toBeUndefined();
    });

    it('should return read a configuration from an environment', () => {
        const result = parseEnvironmentVariables({
            SHELLBOARD_CONFIG: 'custom.json',
            BASIC_AUTH_USERNAME: 'user',
            BASIC_AUTH_PASSWORD: 'password',
            SERVER_HOSTNAME: '1.2.3.4',
            SERVER_PORT: '1234',
            HTTP_LOG_FORMAT: 'custom-format'
        });

        expect(result.validationError).toBeUndefined();
        expect(result.env).toBeDefined();

        const env: AppEnvironment = result.env as any;
        expect(env.configFilePath).toEqual('custom.json');
        expect(env.basicAuthUsername).toEqual('user');
        expect(env.basicAuthPassword).toEqual('password');
        expect(env.hostname).toEqual('1.2.3.4');
        expect(env.port).toBe(1234);
        expect(env.httpLogFormat).toBe('custom-format');
    });

    it('should return a validation error in case BASIC_AUTH_PASSWORD is missed for Basic Auth', () => {
        const result = parseEnvironmentVariables({BASIC_AUTH_USERNAME: 'user'});
        expect(result.validationError).toContain('BASIC_AUTH_PASSWORD is missed');
    });

    it('should return a validation error in case BASIC_AUTH_USERNAME is missed for Basic Auth', () => {
        const result = parseEnvironmentVariables({BASIC_AUTH_PASSWORD: 'password'});
        expect(result.validationError).toContain('BASIC_AUTH_USERNAME is missed');
    });

    it('should return a validation error in case SERVER_PORT cannot be parsed', () => {
        const result = parseEnvironmentVariables({SERVER_PORT: 'foo'});
        expect(result.validationError).toContain('SERVER_PORT is not valid');
    });
});
