export type UserRole = "ADMIN" | "MANAGER" | "FIELD_USER";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type CurrentUserResponse = {
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};
