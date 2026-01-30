import Invoice from "../models/Invoice.js";

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private

const createInvoice = async (req, res) => {
  try {
    const user = req.user;
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    // subtotal calculation
    let subtotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      subtotal += item.unitPrice * item.quantity;
      taxTotal +=
        (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
    });

    const total = subtotal + taxTotal;

    const invoice = new Invoice({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subtotal,
      taxTotal,
      total,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500);
    throw new Error("Error creating invoice");
  }
};

// @desc    Get all invoices for the logged-in user
// @route   GET /api/invoices
// @access  Private

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    res.json(invoices);
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching invoices");
  }
};

// @desc    Get a single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }
    res.json(invoice);
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching invoice");
  }
};
// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private

const updateInvoice = async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Error updating invoice");
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Error deleting invoice");
  }
};

export {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
