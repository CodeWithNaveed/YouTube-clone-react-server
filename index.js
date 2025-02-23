import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

// MongoDB Connection Function
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

// Check Environment Variable
if (!process.env.MONGO) {
    console.error("MONGO URI is missing in .env file");
    process.exit(1);
}
 
// Middlewares
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
)); // Handle CORS
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Hello from Server!");
});

// Catch-all Route
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error Middleware:", err);
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    connect(); // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});
