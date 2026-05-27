import { Request, Response, NextFunction } from "express";
export function responseTimeLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on("finish", () => {
        const time = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${time}ms`);
    });
    next();
}