import {RequestHandler} from 'express';
import passport, {Strategy} from 'passport';
import {BasicStrategy} from 'passport-http';

export function createBasicAuthStrategy(expectedUsername: string, expectedPassword: string): Strategy {
    return new BasicStrategy((username, password, done) => {
        if (username === expectedUsername && password === expectedPassword) {
            return done(null, username);
        }
        return done(null, false);
    });
}

export function createAuthFilter(): RequestHandler {
    return passport.authenticate('basic', {session: false});
}
