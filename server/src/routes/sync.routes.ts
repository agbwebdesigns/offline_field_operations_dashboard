import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth.js";

export const syncRouter = Router();

syncRouter.post("/", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Sync route not implemented yet",
  });
});
