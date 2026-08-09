import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });


connectDB();

const app = express();

app.use(
  cors({
    origin: true, // Replace with your frontend URL  
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job Board API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
