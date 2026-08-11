import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";


export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  
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
