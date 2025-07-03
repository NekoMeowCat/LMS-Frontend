import { api } from "./http";
import { BASE_URL } from "../config";

/**
 * Get CSRF token from Laravel backend
 * Required before making authenticated requests (e.g., registration)
 * when using Laravel Sanctum
 */
async function getCsrf(): Promise<void> {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include", // Ensure cookies are included in the request
  });
}

// Payload type for login request
type LoginPayload = {
  email: string;
  password: string;
};

// Payload type for register request
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// Expected structure of successful auth response from the backend
type AuthResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token?: string; // Optional token (used if API is token-based, e.g., Passport or JWT)
};

/**
 * Send login request to Laravel backend
 *
 * @param payload - Object containing email and password
 * @returns Authenticated user data (with optional token)
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    // Note: CSRF not required here unless Laravel explicitly checks it (usually needed only for session auth)
    const res = await api<AuthResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return res;
  } catch (err: any) {
    // Log and rethrow error for frontend error handling
    console.error("[LOGIN ERROR]", err);
    throw new Error(err?.message || "Login failed");
  }
}

/**
 * Send registration request to Laravel backend
 *
 * @param payload - Object containing registration details
 * @returns Registered user data (with optional token)
 */
export async function registerUser(
  payload: RegisterPayload
): Promise<AuthResponse> {
  try {
    // Required for Sanctum to issue proper session cookie
    await getCsrf();

    const res = await api<AuthResponse>("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return res;
  } catch (err: any) {
    // Log and rethrow error for frontend error handling
    console.error("[REGISTER ERROR]", err);
    throw new Error(err?.message || "Registration failed");
  }
}

/**
 * Logs out the current user by calling Laravel's logout endpoint
 * This clears the Sanctum session cookie
 */
export async function logoutUser(): Promise<void> {
  try {
    await api("/logout", {
      method: "POST",
    });
  } catch (err: any) {
    console.error("[LOGOUT ERROR]", err);
  }
}
