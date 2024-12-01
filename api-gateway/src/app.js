// app.js
import express, { json } from "express";
import cors from "cors";
import setupSwagger from "./config/Swagger.js";

import {
  handleUsersRequest,
  handleOrdersRequest,
  handleProductsRequest,
  handleCartRequest,
  handleCheckoutRequest,
} from "./controllers/ApiGatewayController.js";

const app = express();
const PORT = process.env.PORTGATEWAY || 3005;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

setupSwagger(app);

// Routes vers les microservices
app.use("/users", handleUsersRequest);
app.use("/orders", handleOrdersRequest);
app.use("/products", handleProductsRequest);
app.use("/cart/checkout", handleCheckoutRequest);
app.use("/cart", handleCartRequest);
app.use("/", (req, res) => {
  res.send("API Gateway");
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

export default app;