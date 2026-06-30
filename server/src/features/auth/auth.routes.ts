import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCurrentUser, login, logout } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/logout", logout);
