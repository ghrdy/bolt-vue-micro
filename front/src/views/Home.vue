<template>
  <div class="space-y-12">
    <section class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to GRAPHIXHUB</h1>
      <p class="text-xl text-gray-600 mb-8">Your Ultimate Destination for High-Performance Computing</p>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="(feature, index) in features" :key="index" 
           class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <img :src="feature.image" :alt="feature.title" class="w-full h-48 object-cover"/>
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
          <router-link 
            :to="feature.link" 
            class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Learn More
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  {
    title: 'Graphics Cards',
    description: 'Latest GPUs for gaming and professional work',
    image: '/src/assets/p3.jpeg',
    link: '/products'
  },
  {
    title: 'Processors',
    description: 'High-performance CPUs for every need',
    image: '/src/assets/p5.jpeg',
    link: '/products'
  },
  {
    title: 'Custom Builds',
    description: 'Complete PC solutions tailored for you',
    image: '/src/assets/p4.jpeg',
    link: '/products'
  }
])
</script>