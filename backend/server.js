require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const ConnectDB = require("./config/db");

const app = express();

// Middleware to handle CORS

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}));

// Connect to the database
ConnectDB();

// Middleware to parse JSON requests
app.use(express.json());


// Routes

// start Server

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));