import { apiRequest } from "../../shared/api/client";
import type { CurrentUserResponse, LoginInput, LoginResponse } from "./types";

export const login = async (input: LoginInput) => {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
};

export const getCurrentUser = async (token: string) => {
  return apiRequest<CurrentUserResponse>("/auth/me", {
    token,
  });
};
