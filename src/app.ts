import express, {Application, RequestHandler, Router} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export interface ApplicationOptions {
    authFilter?: RequestHandler;
    apiRouter: Router;
    httpLogFormat: string;
    publicDir: string;
}

export function createApplication(options: ApplicationOptions): Application {
    const app: Application = express();

    app.use(morgan(options.httpLogFormat));
    app.use(helmet());

    if (options.authFilter) {
        app.use('*', options.authFilter);
    }

    app.use('/api', options.apiRouter);
    app.use('/', express.static(options.publicDir));
    return app;
}
