// const express = require('express');
import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = 5001;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
});

// http://localhost:5001/hello

// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  server.close(async() => {
    await disconnectDB();
  });
  process.exit(1);
});

// handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.log("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// graceful shutdown on SIGTERM
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
