import {Storage} from './storage';

/**
 * An in-memory container of shell commands that mocks a real storage.
 */
export class DummyStorage implements Storage {
    constructor(private readonly commands: ReadonlyArray<string>) {}

    getShellCommands(): ReadonlyArray<string> {
        return this.commands;
    }

    getShellCommand(index: number): string | undefined {
        return this.commands[index];
    }
}
