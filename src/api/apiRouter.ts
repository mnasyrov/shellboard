import {Router} from 'express';

/**
 * Creates a router for "api" resource.
 */
export function createApiRouter(commandsRouter: Router) {
    const router = Router();
    router.use('/commands', commandsRouter);
    return router;
}
