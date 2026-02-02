import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
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

    console.log("Calling Gemini API...");
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
