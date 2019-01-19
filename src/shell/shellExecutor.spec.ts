import {ShellExecutor} from './shellExecutor';

describe('ShellExecutor #slow', () => {
    const shellExecutor = new ShellExecutor();

    describe('method execute()', () => {
        it('should execute "echo" command', async () => {
            const command = 'echo foo';
            const result = await shellExecutor.execute(command);

            expect(result.command).toEqual(command);
            expect(result.exitStatus).toBe(0);
            expect((result.stdout || '').trim()).toEqual('foo');
            expect(result.stderr).toEqual('');
        });

        it('should return exit status of a failed command', async () => {
            const command = '__not_existed_command__';
            const result = await shellExecutor.execute(command);

            expect(result.command).toEqual(command);
            expect(result.exitStatus).not.toBe(0);
            expect(result.stdout).toEqual('');
            expect(result.stderr).toBeTruthy();
        });
    });
});
