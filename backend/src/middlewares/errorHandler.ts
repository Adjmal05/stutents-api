import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Doit être déclaré en dernier dans index.ts
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Erreur interne du serveur";

  console.error(`[Erreur ${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}
