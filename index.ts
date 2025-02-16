import type { Request, Response } from "express";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

// CORS Middleware, whitelist origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: (origin: string, callback: CallableFunction) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), "Not allowed by CORS");
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Routes
const jokeRoutes = require("./routes/jokeRoutes");
app.use("/api/joke", jokeRoutes);

// Root route - Serve HTML
app.get("/", (req: Request, res: Response) => {
  res.sendFile("./public/index.html"); // Serve HTML file on homepage
});

// Global Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB & Start Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
