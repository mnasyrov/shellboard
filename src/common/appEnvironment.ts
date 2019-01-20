export interface AppEnvironment {
    configFilePath: string;
    serverHost: string;
    serverPort: number;
    httpLogFormat: string;
    basicAuth: {username: string; password: string} | undefined;
}
