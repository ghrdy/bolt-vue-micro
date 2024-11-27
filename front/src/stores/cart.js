import { defineStore } from "pinia";
import api from "../config/api";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
  }),

  getters: {
    itemCount: (state) => state.items.length,
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    async addToCart(product) {
      try {
        const response = await api.post("/cart/add", {
          user_id: localStorage.getItem("userId"),
          product_id: product._id,
          quantity: 1,
        });
        await this.fetchCart();
        return response;
      } catch (error) {
        throw error;
      }
    },

    async fetchCart() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        this.loading = true;
        const response = await api.get(`/cart/user/${userId}`);
        this.items = response.data.cart.items;
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, quantity) {
      try {
        await api.put("/cart/update", {
          user_id: localStorage.getItem("userId"),
          product_id: productId,
          quantity,
        });
        await this.fetchCart();
      } catch (error) {
        throw error;
      }
    },

    async removeFromCart(productId) {
      try {
        await api.delete("/cart/remove", {
          data: {
            user_id: localStorage.getItem("userId"),
            product_id: productId,
          },
        });
        await this.fetchCart();
      } catch (error) {
        throw error;
      }
    },
  },
});
