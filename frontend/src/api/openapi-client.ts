import createClient from "openapi-fetch";
import type { paths, components } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "";

// Create typed API client
const client = createClient<paths>({ baseUrl: API_URL });

// Token storage helpers
const getAccessToken = (): string | null =>
  localStorage.getItem("access_token");
const getRefreshToken = (): string | null =>
  localStorage.getItem("refresh_token");

export const setTokens = (tokens: {
  access: string;
  refresh: string;
}): void => {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Add auth middleware
client.use({
  async onRequest({ request }) {
    const token = getAccessToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    // Handle 401 - attempt token refresh
    if (response.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const { data } = await client.POST("/api/token/refresh/", {
          body: { refresh: refreshToken },
        });
        if (data?.access) {
          localStorage.setItem("access_token", data.access);
          // Note: The original request won't be retried automatically
          // The component should handle re-fetching
        } else {
          clearTokens();
          window.location.href = "/login";
        }
      } else {
        clearTokens();
        window.location.href = "/login";
      }
    }
    return response;
  },
});

// Export typed schemas for convenience
export type User = components["schemas"]["User"];
export type TokenObtainPairRequest =
  components["schemas"]["TokenObtainPairRequest"];
export type TokenObtainPair = components["schemas"]["TokenObtainPair"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type Register = components["schemas"]["Register"];
export type ChangePasswordRequest =
  components["schemas"]["ChangePasswordRequest"];
export type PatchedUserRequest = components["schemas"]["PatchedUserRequest"];

export default client;
