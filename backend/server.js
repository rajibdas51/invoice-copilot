import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import {ConnectDB} from './config/db.js';
import authRoutes from './routes/authRoutes.js'
dotenv.config();

// app config
const app = express();
const PORT = process.env.PORT || 5000;

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
app.use("/api/auth",authRoutes)
app.use('/', (req, res) => {
    res.send("API is running...");
});
// start Server



app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));