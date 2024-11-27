<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Our Products</h1>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-red-600 text-center">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product._id" 
           class="bg-white rounded-lg shadow-md overflow-hidden">
        <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover"/>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
          <p class="text-gray-600 mb-4">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">${{ product.price }}</span>
            <button 
              @click="addToCart(product)"
              :disabled="cartStore.loading"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
              {{ cartStore.loading ? 'Adding...' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Messages -->
    <div v-if="showToast" 
         class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cart'
import axios from 'axios'

const toast = useToast()
const cartStore = useCartStore()
const products = ref([])
const loading = ref(false)
const error = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3005/products/liste')
    products.value = response.data
  } catch (err) {
    error.value = 'Failed to load products'
    toast.error('Failed to load products')
  } finally {
    loading.value = false
  }
}

const addToCart = async (product) => {
  try {
    await cartStore.addToCart(product)
    showToastMessage('Product added to cart')
    toast.success('Product added to cart')
  } catch (err) {
    showToastMessage('Failed to add product to cart')
    toast.error('Failed to add product to cart')
  }
}

onMounted(fetchProducts)
</script>