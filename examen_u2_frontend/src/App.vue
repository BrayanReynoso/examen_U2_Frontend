<script setup>
import Carousel from './components/CarouselComponent.vue';
const handleClick = (message) => {
  console.log(message);
}
</script>

<template>
  <div id="container" class="text-center">
    <Carousel />
    <div class="mt-4">
      <b-button @click="handleClick('Ordenar por autor')" class="me-2">Ordenar por autor</b-button>
      <b-button @click="handleClick('Ordenar por fecha')" class="me-2">Ordenar por fecha</b-button>
      <b-button @click="handleClick('Mostrar si tiene imagen')" >Mostrar si tiene imagen</b-button>
    </div>
  </div>
</template>
