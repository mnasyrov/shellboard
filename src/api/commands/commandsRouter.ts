import {Router} from 'express';
import {ShellExecutor} from '../../shell/shellExecutor';
import {Storage} from '../../storages/storage';
import {executeCommandHandler} from './executeCommandHandler';
import {getCommandHandler} from './getCommandHandler';
import {listCommandsHandler} from './listCommandsHandler';

export function createCommandsRouter(storage: Storage, shellExecutor: ShellExecutor) {
    const router = Router();
    router.get('/', listCommandsHandler(storage));
    router.get('/:index', getCommandHandler(storage));
    router.post('/:index/execute', executeCommandHandler(storage, shellExecutor));
    return router;
}
