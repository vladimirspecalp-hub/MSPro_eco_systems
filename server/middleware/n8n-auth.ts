/**
 * n8n Authentication Middleware
 * Защита endpoints для интеграции с n8n через shared secret
 * @module server/middleware/n8n-auth
 */

import { Request, Response, NextFunction } from "express";

const N8N_SECRET = process.env.N8N_WEBHOOK_SECRET || "mspro-n8n-secret-dev";

/**
 * Middleware для проверки n8n webhook secret
 * Ожидает заголовок X-N8N-Secret или query параметр secret
 */
export function n8nAuthMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  const headerSecret = req.headers["x-n8n-secret"] as string;
  const querySecret = req.query.secret as string;
  const providedSecret = headerSecret || querySecret;

  if (!providedSecret) {
    res.status(401).json({ 
      error: "Missing authentication",
      message: "X-N8N-Secret header or secret query parameter required"
    });
    return;
  }

  if (providedSecret !== N8N_SECRET) {
    res.status(403).json({ 
      error: "Invalid authentication",
      message: "Invalid secret provided"
    });
    return;
  }

  next();
}

/**
 * Опциональная аутентификация - не блокирует, но добавляет флаг
 */
export function n8nAuthOptional(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  const headerSecret = req.headers["x-n8n-secret"] as string;
  const querySecret = req.query.secret as string;
  const providedSecret = headerSecret || querySecret;

  (req as any).isN8nAuthenticated = providedSecret === N8N_SECRET;
  next();
}
