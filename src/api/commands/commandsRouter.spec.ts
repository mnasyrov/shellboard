import express, {Application} from 'express';
import supertest from 'supertest';
import {DummyShellExecutor} from '../../shell/dummyShellExecutor';
import {DummyStorage} from '../../storages/dummyStorage';
import {createCommandsRouter} from './commandsRouter';

function createTestbed(): Application {
    const storage = new DummyStorage(['echo foo', 'echo bar']);
    const executor = new DummyShellExecutor();
    return express().use(createCommandsRouter(storage, executor));
}

describe('API "commands" router', () => {
    describe('GET / ', () => {
        it('should return a list of commands', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                commands: ['echo foo', 'echo bar']
            });
        });
    });

    describe('GET /:index', () => {
        it('should return a command', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).get('/0');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                command: 'echo foo'
            });
        });

        it('should return 400 status in case the index cannot be parsed', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).get('/text-value');
            expect(response.status).toBe(400);
        });

        it('should return 404 status  in case an item is not found', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).get('/100');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /:index', () => {
        it('should return a result of command execution', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).post('/0/execute');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                command: 'echo foo',
                stdout: 'echo foo',
                stderr: 'ECHO FOO',
                exitStatus: 0
            });
        });

        it('should return 400 status in case the index cannot be parsed', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).post('/text-value/execute');
            expect(response.status).toBe(400);
        });

        it('should return 404 status  in case an item is not found', async () => {
            const testbed = createTestbed();
            const response = await supertest(testbed).post('/100/execute');
            expect(response.status).toBe(404);
        });
    });
});
