import { BASE_URL } from "../config";

/**
 * Generic API helper function to send HTTP requests to the Laravel backend.
 *
 * @template T - The expected return type (default: any)
 * @param endpoint - The relative endpoint (e.g., "/api/login")
 * @param options - Fetch API options (method, headers, body, etc.)
 * @returns A promise that resolves with the response data typed as T
 */
export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    // Merge default headers with custom headers
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important: Sends cookies for session auth (e.g., Laravel Sanctum)
    ...options, // Include other fetch options like method, body, etc.
  });

  // Read the response as plain text first to safely handle invalid JSON
  const text = await response.text();

  let data: any;
  try {
    // Attempt to parse JSON (if not empty)
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Parsing failed — likely server error or non-JSON response
    throw new Error("Invalid JSON returned from server.");
  }

  // Check if HTTP response status is not OK (i.e., not 2xx)
  if (!response.ok) {
    // Extract error message if available, otherwise use generic message
    const errorMessage = data?.message || "An error occurred.";
    throw new Error(errorMessage);
  }

  // Return parsed data
  return data;
}
