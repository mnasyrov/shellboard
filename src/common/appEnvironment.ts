export interface AppEnvironment {
    hostname: string;
    port: number;
    configFilePath: string;
    basicAuthUsername: string | undefined;
    basicAuthPassword: string | undefined;
    httpLogFormat: string;
}
