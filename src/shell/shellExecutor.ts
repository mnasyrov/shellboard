import {exec} from 'child_process';
import {ShellExecutionResult} from './shellExecutionResult';

export class ShellExecutor {
    async execute(command: string): Promise<ShellExecutionResult> {
        return new Promise<ShellExecutionResult>(resolve => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    resolve({command, exitStatus: error.code, stdout, stderr});
                    return;
                }
                resolve({command, stdout, stderr});
            });
        });
    }
}
