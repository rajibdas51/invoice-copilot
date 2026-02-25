export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Sign up
    LOGIN: "/api/auth/login", // Authenticate user and return JWT token
    GET_PROFILE: "/api/auth/me", // Get logged-in user profile
    UPDATE_PROFILE: "/api/auth/me", // Update user profile
  },
  INVOICE: {
    CREATE: "/api/invoices", // Create a new invoice
    GET_ALL_INVOICES: "/api/invoices", // Get all invoices for the logged-in user
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`, // Get a specific invoice by ID
    UPDATE_INVOICE: (id) => `/api/invoices/${id}`, // Update a specific invoice by ID
    DELETE_INVOICE: (id) => `/api/invoices/${id}`, // Delete a specific invoice by ID
  },
  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text", // Parse invoice data from text using AI
    GENERATE_REMINDER: "/api/ai/generate-reminder", // Generate reminder email for overdue invoices
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary", // Get dashboard summary using AI
  },
};
