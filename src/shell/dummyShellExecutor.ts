import {ShellExecutionResult} from './shellExecutionResult';
import {ShellExecutor} from './shellExecutor';

/**
 * A mocked shell executor which echo a command to `stdout` and `stderr` (uppercased).
 */
export class DummyShellExecutor extends ShellExecutor {
    async execute(command: string): Promise<ShellExecutionResult> {
        return {
            command,
            stdout: command,
            stderr: command.toUpperCase(),
            exitStatus: 0
        };
    }
}
