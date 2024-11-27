import { defineStore } from "pinia";
import api from "../config/api";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.items.length,
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    async addToCart(product) {
      try {
        this.loading = true;
        const response = await api.post("/api/cart/add", {
          user_id: localStorage.getItem("userId"),
          product_id: product._id,
          quantity: 1,
        });
        
        if (response.data.success) {
          await this.fetchCart();
          return response;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        this.error = error.message || 'Error adding item to cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCart() {
      try {
        this.loading = true;
        const userId = localStorage.getItem("userId");
        if (!userId) {
          this.items = [];
          return;
        }

        const response = await api.get(`/api/cart/user/${userId}`);
        if (response.data.success && response.data.cart) {
          this.items = response.data.cart.items || [];
        } else {
          this.items = [];
        }
      } catch (error) {
        this.error = error.message || 'Error fetching cart';
        console.error("Error fetching cart:", error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, quantity) {
      try {
        this.loading = true;
        const response = await api.put("/api/cart/update", {
          user_id: localStorage.getItem("userId"),
          product_id: productId,
          quantity,
        });
        
        if (response.data.success) {
          await this.fetchCart();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        this.error = error.message || 'Error updating quantity';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFromCart(productId) {
      try {
        this.loading = true;
        const response = await api.delete("/api/cart/remove", {
          data: {
            user_id: localStorage.getItem("userId"),
            product_id: productId,
          },
        });
        
        if (response.data.success) {
          await this.fetchCart();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        this.error = error.message || 'Error removing item from cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  },
});