import client, {
  setTokens,
  clearTokens,
  type User,
  type TokenObtainPairRequest,
  type TokenObtainPair,
  type RegisterRequest,
  type Register,
} from "./openapi-client";

export const login = async (
  credentials: TokenObtainPairRequest
): Promise<TokenObtainPair> => {
  const { data, error } = await client.POST("/api/token/", {
    body: credentials,
  });

  if (error || !data) {
    throw new Error("Login failed");
  }

  setTokens(data);
  return data;
};

export const register = async (data: RegisterRequest): Promise<Register> => {
  const { data: responseData, error } = await client.POST(
    "/api/users/register/",
    {
      body: data,
    }
  );

  if (error || !responseData) {
    throw new Error("Registration failed");
  }

  return responseData;
};

export const logout = (): void => {
  clearTokens();
};

export const getProfile = async (): Promise<User> => {
  const { data, error } = await client.GET("/api/users/profile/");

  if (error || !data) {
    throw new Error("Failed to fetch profile");
  }

  return data;
};

export const updateProfile = async (
  userData: Partial<User>
): Promise<User> => {
  const { data, error } = await client.PATCH("/api/users/profile/", {
    body: userData,
  });

  if (error || !data) {
    throw new Error("Failed to update profile");
  }

  return data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const { error } = await client.POST("/api/users/change-password/", {
    body: {
      old_password: oldPassword,
      new_password: newPassword,
    },
  });

  if (error) {
    throw new Error("Failed to change password");
  }
};

// Re-export types and utilities
export { setTokens, clearTokens } from "./openapi-client";
export type { User, TokenObtainPairRequest, RegisterRequest } from "./openapi-client";
