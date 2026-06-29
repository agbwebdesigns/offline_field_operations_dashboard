import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env, isProduction } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

if (!isProduction) {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "offline-field-operations-api",
  });
});

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);
