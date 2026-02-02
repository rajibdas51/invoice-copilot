import express from "express";
import {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
} from "../controllers/aiController.js";
import protect from "../middlewares/authMiddleware.js";
const aiRouter = express.Router();

aiRouter.post("/parse-text", protect, parseInvoiceFromText);
aiRouter.post("/generate-reminder", protect, generateReminderEmail);
aiRouter.get("/dashboard-summary", protect, getDashboardSummary);
export default aiRouter;
