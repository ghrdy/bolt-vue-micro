import express, { Request, Response } from "express";
import connectDB from "./config/db";
import UserRouter from "./routes/UserRoute";
import cors from "cors";
import cookieParser from 'cookie-parser';
import setupSwagger from "./config/swagger";

const app = express();
const port = process.env.PORTUSERS || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // Important pour les cookies
}));
app.use(cookieParser());
app.use(express.json());

// Database connection
connectDB();

// Swagger setup
setupSwagger(app);

// Routes
app.use("/users", UserRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;