export interface Storage {
    getShellCommands(): ReadonlyArray<string>;

    getShellCommand(index: number): string | undefined;
}
