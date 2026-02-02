import { GoogleGenAI } from "@google/genai";

import Invoice from "../models/invoiceModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("Text is required");
  }
  try {
    const prompt = `you are an expert at invoice data extraction. Analyze the follwing text and extract the relevant information to create an invoice. The output MUST be a vaild JSON object
    
    The JSON object should have the following structure:
    { 

    "clientName":"string",
    "email":"string",
    "address":"string",
    "items":[
          {
             "name":"string",
             "quantity":number,
             "unitprice":number}
    ]
    }

    here is the text to parse:
    --- TEXT START ---
    ${text}
    --- TEXT END ---


    Extract the data and provide ONLY the JSON object as output without any additional text or explanation.
    `;
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res.status(500);
    throw new Error("Failed to parse invoice data from text");
  }
};

const generateReminderEmail = async (req, res) => {
  try {
    try {
    } catch (error) {
      console.error("Error generating reminder email with AI:", error);
      res.status(500);
      throw new Error("Failed to generate reminder email with AI");
    }
  } catch (error) {}
};

const getDashboardSummary = async (req, res) => {
  try {
    try {
    } catch (error) {
      console.error("Error generating dashboard summary with AI:", error);
      res.status(500);
      throw new Error("Failed to generate dashboard summary with AI");
    }
  } catch (error) {}
};

export { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };
