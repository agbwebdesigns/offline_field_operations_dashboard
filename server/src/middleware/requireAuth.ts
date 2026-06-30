import type { NextFunction, Request, Response } from "express";

import { verifyAuthToken } from "../features/auth/auth.service.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length);
  const user = verifyAuthToken(token);

  if (!user) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
    return;
  }

  req.user = user;

  next();
};
