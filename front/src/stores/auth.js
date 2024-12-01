import { defineStore } from 'pinia'
import api from '../config/api'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: localStorage.getItem('userId') || null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/users/login', credentials, {
          withCredentials: true // Important pour les cookies
        });
        this.setAuth(response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/users/register', userData, {
          withCredentials: true
        });
        this.setAuth(response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    setAuth(data) {
      this.userId = data.userId;
      this.isAuthenticated = true;
      localStorage.setItem('userId', data.userId);
    },

    async logout() {
      try {
        await api.post('/users/logout', {}, {
          withCredentials: true
        });
        this.userId = null;
        this.isAuthenticated = false;
        localStorage.removeItem('userId');
        const cartStore = useCartStore();
        cartStore.clearCart();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
});