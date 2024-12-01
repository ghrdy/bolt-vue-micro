// controllers/ApiGatewayController.js
import axios from "axios";

const createProxyRequest = async (req, res, targetUrl) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.originalUrl}`,
      data: req.body,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host,
      },
      withCredentials: true
    });

    // Forward cookies from microservice response
    if (response.headers['set-cookie']) {
      res.set('set-cookie', response.headers['set-cookie']);
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.message,
      details: error.response?.data
    });
  }
};

export const handleCartRequest = (req, res) => {
  createProxyRequest(req, res, "http://cart_service:3003");
};

export const handleUsersRequest = (req, res) => {
  createProxyRequest(req, res, "http://user-service:3001");
};

export const handleOrdersRequest = (req, res) => {
  createProxyRequest(req, res, "http://order-service:3000");
};

export const handleProductsRequest = (req, res) => {
  createProxyRequest(req, res, "http://products-service:3002");
};

export const handleCheckoutRequest = (req, res) => {
  createProxyRequest(req, res, "http://cart_service:3003");
};