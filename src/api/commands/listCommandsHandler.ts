import {RequestHandler} from 'express';
import {Storage} from '../../storages/storage';

export interface ListCommandsResponseBody {
    commands: ReadonlyArray<string>;
}

/**
 * Creates a request handler for listing shell commands.
 */
export function listCommandsHandler(storage: Storage): RequestHandler {
    return (request, response) => {
        const commands = storage.getShellCommands();
        const body: ListCommandsResponseBody = {commands};
        response.send(body);
    };
}
