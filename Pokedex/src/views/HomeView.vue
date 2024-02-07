<template>
  <div>
    <TheHeader/>
    <TheFilterAndPagination/>
    <ThePokedex/>
    <TheFooter/>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import ThePokedex from '@/components/ThePokedex.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheFilterAndPagination from '@/components/TheFilterAndPagination.vue'; // Asegúrate de que la ruta sea correcta
</script>
