import type { NextFunction, Request, Response } from "express";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  // Temporary placeholder.
  // Later this will verify a JWT and attach req.user.
  req.user = {
    id: "dev-user-id",
    email: "dev@example.com",
    role: "ADMIN",
  };

  next();
};
