import {Storage} from './storage';

export class DummyStorage implements Storage {
    constructor(private readonly commands: ReadonlyArray<string>) {}

    getShellCommands(): ReadonlyArray<string> {
        return this.commands;
    }

    getShellCommand(index: number): string | undefined {
        return this.commands[index];
    }
}
