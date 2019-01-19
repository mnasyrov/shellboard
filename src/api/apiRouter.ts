import {Router} from 'express';

export function createApiRouter(commandsRouter: Router) {
    const router = Router();
    router.use('/commands', commandsRouter);
    return router;
}
