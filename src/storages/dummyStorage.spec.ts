import {DummyStorage} from './dummyStorage';

describe('DummyStorage', () => {
    const storage = new DummyStorage(['foo', 'bar']);

    describe('method getShellCommands()', () => {
        it('should return all commands', () => {
            expect(storage.getShellCommands()).toEqual(['foo', 'bar']);
        });
    });

    describe('method getShellCommand()', () => {
        it('should return a command by an index', () => {
            expect(storage.getShellCommand(1)).toBe('bar');
        });

        it('should return `undefined` in case a command is not found', () => {
            expect(storage.getShellCommand(-1)).toBeUndefined();
            expect(storage.getShellCommand(100)).toBeUndefined();
        });
    });
});
