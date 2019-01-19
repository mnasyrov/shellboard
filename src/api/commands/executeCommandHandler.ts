import {RequestHandler} from 'express';
import {ShellExecutor} from '../../shell/shellExecutor';
import {Storage} from '../../storages/storage';

export interface ExecuteCommandResponseBody {
    command: string;
    exitStatus: number | undefined;
    stdout: string | undefined;
    stderr: string | undefined;
}

export function executeCommandHandler(storage: Storage, shellExecutor: ShellExecutor): RequestHandler {
    return async (request, response, next) => {
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

        let result;
        try {
            result = await shellExecutor.execute(command);
        } catch (error) {
            next(error);
            return;
        }

        const body: ExecuteCommandResponseBody = {
            command: result.command,
            exitStatus: result.exitStatus,
            stdout: result.stdout,
            stderr: result.stderr
        };
        response.send(body);
    };
}
