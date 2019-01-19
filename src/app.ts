import express, {Application, RequestHandler, Router} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export interface ApplicationOptions {
    authFilter?: RequestHandler;
    apiRouter: Router;
    httpLogFormat: string;
}

export function createApplication(options: ApplicationOptions): Application {
    const app: Application = express();

    app.use(morgan(options.httpLogFormat));
    app.use(helmet());

    if (options.authFilter) {
        app.use('*', options.authFilter);
    }

    app.use('/api', options.apiRouter);
    return app;
}
