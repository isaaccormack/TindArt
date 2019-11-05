import { Request, Response, NextFunction } from "express";
import errorHandler from "errorhandler";

// Options for error handler. log
interface IOptions {
    dev: boolean;
    log: boolean | errorHandler.LoggingCallback;
}

// Default to errorhandler middleware for now, and in dev.
// errorhandler middleware is not for production, though, as it gives a stacktrace, so we implement our own.
// TODO: test this, fix it up a bit, and implement other error handlers. This isn't really meant for milestone 3.
export function getErrorHandler(options?: IOptions) {
    if (options === undefined) {
        options = {dev: false, log: true};
    }

    if (options.dev === true) {
        return errorHandler({log: options.log});
    } else {
        return (err: any, req: Request, res: Response, next: NextFunction) => {
            const status = err.steatus || err.statusCode || 500;
            res.locals.title = "Error";
            res.locals.status = status; // This shouldn't be necessary, but idk how to get res.status in pug
            res.status(status);
            res.render("errorlayout");
        };
    }
}
