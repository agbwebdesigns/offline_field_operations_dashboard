import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";

export const userRouter = Router();

userRouter.get("/", requireAuth, requireRole("ADMIN", "MANAGER"), (_req, res) => {
  res.status(501).json({
    message: "User list route not implemented yet",
  });
});
