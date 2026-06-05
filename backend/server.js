import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import passport from "./config/passport.js";
import { ConnectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import invoiceRouter from "./routes/invoiceRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

ConnectDB();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:3000",
  "https://invoicecopilot.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Keep your cors() package below this as a fallback
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiRouter);
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/", (req, res) =>
  res.status(200).json({ status: "server is running" }),
);
// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
