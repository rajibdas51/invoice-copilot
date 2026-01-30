import express from "express";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import protect from "../middlewares/authMiddleware.js";

const invoiceRouter = express.Router();

invoiceRouter.route("/").post(protect, createInvoice).get(protect, getInvoices);

invoiceRouter
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

export default invoiceRouter;
