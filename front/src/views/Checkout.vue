<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Order Summary -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div class="space-y-4">
          <div v-for="item in cartStore.items" :key="item.product_id" class="flex justify-between">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t pt-4 font-bold">
            <div class="flex justify-between">
              <span>Total</span>
              <span>${{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Payment Details</h2>
        <form @submit.prevent="handleCheckout" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              v-model="cardNumber"
              placeholder="1234 5678 9012 3456"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                v-model="expiryDate"
                placeholder="MM/YY"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                v-model="cvv"
                placeholder="123"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ loading ? 'Processing...' : 'Complete Purchase' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const loading = ref(false)

const handleCheckout = async () => {
  try {
    loading.value = true
    // Implement checkout logic here
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulated API call
    toast.success('Order placed successfully!')
    router.push('/')
  } catch (error) {
    toast.error('Failed to process payment')
  } finally {
    loading.value = false
  }
}
</script>