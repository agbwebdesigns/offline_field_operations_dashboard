import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { authStorage } from "./authStorage";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
