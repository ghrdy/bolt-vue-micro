<template>
  <nav class="bg-gray-900 text-white">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-xl font-bold">GRAPHIXHUB</router-link>
        
        <!-- Mobile menu button -->
        <button @click="toggleMobileMenu" class="md:hidden">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <!-- Desktop menu -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/products" class="hover:text-gray-300">Products</router-link>
          <router-link to="/cart" class="hover:text-gray-300">
            <div class="relative">
              <ShoppingCartIcon class="h-6 w-6" />
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
                {{ cartCount }}
              </span>
            </div>
          </router-link>
          
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="hover:text-gray-300">Login</router-link>
            <router-link to="/register" class="hover:text-gray-300">Register</router-link>
          </template>
          
          <div v-else class="relative">
            <button @click="toggleUserMenu" class="hover:text-gray-300">
              <UserCircleIcon class="h-6 w-6" />
            </button>
            
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/products" class="block px-3 py-2 rounded-md hover:bg-gray-700">Products</router-link>
          <router-link to="/cart" class="block px-3 py-2 rounded-md hover:bg-gray-700">
            Cart
            <span v-if="cartCount > 0" class="ml-2 bg-red-500 text-white rounded-full text-xs px-2">
              {{ cartCount }}
            </span>
          </router-link>
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="block px-3 py-2 rounded-md hover:bg-gray-700">Login</router-link>
            <router-link to="/register" class="block px-3 py-2 rounded-md hover:bg-gray-700">Register</router-link>
          </template>
          <button v-else @click="logout" class="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const isMobileMenuOpen = ref(false)
const cartCount = computed(() => cartStore.itemCount)
const isLoggedIn = computed(() => authStore.isAuthenticated)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
  isMobileMenuOpen.value = false
}
</script>