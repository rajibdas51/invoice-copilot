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

// CORS
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
); // removes undefined if CLIENT_URL isn't set yet

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiRouter);
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
