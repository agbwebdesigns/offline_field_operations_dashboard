import { Router } from "express";

import { authRouter } from "../features/auth/auth.routes.js";
import { syncRouter } from "../features/sync/sync.routes.js";
import { taskRouter } from "../features/tasks/task.routes.js";
import { userRouter } from "../features/users/user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/sync", syncRouter);
