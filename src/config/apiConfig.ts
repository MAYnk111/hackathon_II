/**
 * API Configuration
 * Centralized API URL configuration for frontend
 * Supports both development and production environments
 */

// Get API base URL from environment variable
// Defaults to localhost:5000 for development
const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  ANALYZE_SYMPTOMS: `${API_BASE_URL}/analyze-symptoms`,
  CHAT: `${API_BASE_URL}/chat`,
  VERIFY_MEDICINE: `${API_BASE_URL}/verify-medicine`,
  HEALTH: `${API_BASE_URL}/health`,
} as const;

export { API_BASE_URL };
