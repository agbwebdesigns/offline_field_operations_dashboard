import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", (_req, res) => {
  res.status(501).json({
    message: "Login route not implemented yet",
  });
});

authRouter.post("/logout", (_req, res) => {
  res.status(501).json({
    message: "Logout route not implemented yet",
  });
});

authRouter.get("/me", (_req, res) => {
  res.status(501).json({
    message: "Current user route not implemented yet",
  });
});
