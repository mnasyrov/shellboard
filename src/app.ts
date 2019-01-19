import express, {Application, RequestHandler, Router} from 'express';

export interface ApplicationOptions {
    authFilter?: RequestHandler;
    apiRouter: Router;
    publicDir: string;
}

export function createApplication(options: ApplicationOptions): Application {
    const app: Application = express();

    if (options.authFilter) {
        app.use('*', options.authFilter);
    }

    app.use('/api', options.apiRouter);
    app.use('/', express.static(options.publicDir));
    return app;
}
