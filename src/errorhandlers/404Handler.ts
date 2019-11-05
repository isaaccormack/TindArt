import { Request, Response, NextFunction } from "express";

export function err404handler(req: Request, res: Response, next: NextFunction) {
    res.locals.title = "Page Not Found";
    res.locals.status = 404;
    res.status(404);
    res.render("error404");
}
