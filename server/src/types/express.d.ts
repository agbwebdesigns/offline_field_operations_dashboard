import type { AuthUser } from "./auth.js";

/**
 * Adds `req.user` to Express's Request type.
 *
 * Our auth middleware attaches the authenticated user to `req.user`,
 * but Express does not know about that property by default. This global
 * type augmentation lets TypeScript understand that `req.user` may exist
 * after authentication middleware runs.
 */

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Makes this file a module so TypeScript applies the global declaration
 * correctly and avoids treating the file as a plain script.
 */
export {};
