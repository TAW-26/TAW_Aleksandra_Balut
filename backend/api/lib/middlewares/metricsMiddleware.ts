import { httpRequestsTotal, httpRequestDurationMs, activeConnections } from "../metrics";
import { Request, Response, NextFunction } from "express";
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    activeConnections.inc();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const route = req.route?.path ?? req.path;
        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode),
        };
        httpRequestsTotal.inc(labels);
        httpRequestDurationMs.observe(labels, duration);
        activeConnections.dec();
    });
    next();
}