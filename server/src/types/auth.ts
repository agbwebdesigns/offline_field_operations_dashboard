export type UserRole = "ADMIN" | "MANAGER" | "FIELD_USER";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
