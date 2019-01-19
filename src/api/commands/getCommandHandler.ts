import {RequestHandler} from 'express';
import {Storage} from '../../storages/storage';

export interface GetCommandResponseBody {
    command: string;
}

export function getCommandHandler(storage: Storage): RequestHandler {
    return (request, response) => {
        const index: number = parseInt(request.params.index, 10);
        if (isNaN(index)) {
            response.sendStatus(400);
            return;
        }

        const command = storage.getShellCommand(index);
        if (!command) {
            response.sendStatus(404);
            return;
        }

        const body: GetCommandResponseBody = {command};
        response.send(body);
    };
}
