import type { ApiResponse } from "@/services/api";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function ensureApiSuccess<T>(
  response: ApiResponse<T>,
  fallback: string,
): T {
  if (!response.success) {
    throw new Error(response.message || fallback);
  }

  if (response.data === null || response.data === undefined) {
    throw new Error(response.message || fallback);
  }

  return response.data;
}

export function ensureApiCommandSuccess<T>(
  response: ApiResponse<T>,
  fallback: string,
): T | null {
  if (!response.success) {
    throw new Error(response.message || fallback);
  }

  return response.data;
}
