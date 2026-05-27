import { Request, Response, NextFunction } from "express";
export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
    const log = {
        time: new Date().toISOString(),
        errorType: err.name || "UnknownError",
        message: err.message,
        method: req.method,
        path: req.originalUrl,
        context: {
            params: req.params,
            query: req.query,
            body: req.body
        }
    };
    console.error("SERVER ERROR:", JSON.stringify(log, null, 2));
    res.status(err.status || 500).json({ error: "Internal server error" });
}