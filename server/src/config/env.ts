// const requiredEnv = (key: string): string => {
//   const value = process.env[key];

//   if (!value) {
//     throw new Error(`Missing required environment variable: ${key}`);
//   }

//   return value;
// };

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-only-secret-change-me",
};

export const isProduction = env.NODE_ENV === "production";
