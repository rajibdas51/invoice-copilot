import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { ConnectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import invoiceRouter from "./routes/invoiceRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

// app config
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
ConnectDB();

// Middleware to parse JSON and URL-encoded requests (BEFORE CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle CORS (AFTER body parsers)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use(errorHandler);

// start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
