// routes/products.js
import { Router } from "express";
import axios from "axios";

const router = Router();

// Route pour gérer les products
router.all("/*", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3002${req.originalUrl}`, // URL du microservice des products
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
    });
  }
});

export default router;
