import { GoogleGenerativeAI } from "@google/generative-ai";
import Invoice from "../models/Invoice.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    throw new Error("Text is required");
  }

  try {
    const prompt = `you are an expert at invoice data extraction. Analyze the following text and extract the relevant information to create an invoice. The output MUST be a valid JSON object
    
    The JSON object should have the following structure:
    { 
    "clientName":"string",
    "email":"string",
    "address":"string",
    "items":[
          {
             "name":"string",
             "quantity":number,
             "unitPrice":number}
    ]
    }

    here is the text to parse:
    --- TEXT START ---
    ${text}
    --- TEXT END ---

    Extract the data and provide ONLY the JSON object as output without any additional text or explanation.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsedData = JSON.parse(responseText);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    res.status(500);
    throw new Error("Failed to parse invoice data from text");
  }
};

const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;
  if (!invoiceId) {
    res.status(400);
    throw new Error("Invoice ID is required");
  }
  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    const prompt = `You are a professional and polite accounting assistant. Write a frienldy reminder email to a client about an overdue or upcoming invoice payment.
    Use the following invoice details to personalize the email:
    - Cient Name:${invoice.billTo.clientName}
    - Invoice Number: ${invoice.invoiceNumber}
    -Amount Due: $${invoice.total.toFixed(2)}
    - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
    
    The tone should be friendly and professional but clear. Keep the email concise and to the point. Start the email with "Subject:"

    `;
    // initialize the model and generate the content
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    res.status(200).json({ emailContent: response });
  } catch (error) {
    console.error("Error generating reminder email with AI:", error);
    res.status(500);
    throw new Error("Failed to generate reminder email with AI");
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id });
    if (invoices.length === 0) {
      res.status(200);
      throw new Error("No invoices found for the user");
    }

    // Process and summarize invoice data
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.total,
      0,
    );
    const dataSummary = `
      -Total number of invoices: ${totalInvoices}
      -Total paid invoices: ${paidInvoices.length}
      -Total unpaid/pending invoices: ${unpaidInvoices.length}
      -Total revenue: $${totalRevenue.toFixed(2)}
      -Total outstanding amount from unpaid/pending invoices: $${totalOutstanding.toFixed(2)}
      -Recent invoices(last 5):
      ${invoices
        .slice(0, 5)
        .map(
          (inv) =>
            `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status: ${inv.status}`,
        )
        .join(",  ")}  
    `;

    const prompt = ` You are a professional and insightful financial analyst for a small business owner.based on the following summary of their invoice data, provide 2-3 concise and actionable insights.eachinsight should be a short string in a JSON array.
    The insights should be encouraging and helpful. Do not just repeat the data.
    For example, if there is a high number of unpaid invoices, suggest strategies to improve payment collection. Like, sending reminder emails or offering early payment discounts. If revenue is growing, suggest ways to maintain that growth.

    Data Summary:
    ${dataSummary}
    
    Return your response as a valid JSON object with a single key "insights" containing an array of strings.
    Example format: {"insights":["Your revenue is looking strong this month! ","You have 5 overdue invoices. Consider sending reminders to get paid faster. "]}

  
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const parsedInsights = JSON.parse(responseText);

    res.status(200).json({ insights: parsedInsights.insights });
  } catch (error) {
    console.error("Error generating dashboard summary with AI:", error);
    res.status(500);
    throw new Error("Failed to generate dashboard summary with AI");
  }
};

export { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };
