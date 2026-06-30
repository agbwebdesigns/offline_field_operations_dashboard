import type { Request, Response } from "express";

import { loginUser } from "./auth.service.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({
      message: "Email and password are required",
    });
    return;
  }

  const result = await loginUser(email.toLowerCase().trim(), password);

  if (!result) {
    res.status(401).json({
      message: "Invalid email or password",
    });
    return;
  }

  res.json(result);
};

export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  res.json({
    user: req.user,
  });
};

export const logout = (_req: Request, res: Response) => {
  res.json({
    message: "Logged out",
  });
};
