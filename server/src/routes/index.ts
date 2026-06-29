import { Router } from "express";

import { authRouter } from "./auth.routes.js";
import { syncRouter } from "./sync.routes.js";
import { taskRouter } from "./task.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/sync", syncRouter);
