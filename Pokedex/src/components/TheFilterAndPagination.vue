<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePokemonStore } from '../store/pokemonstore';

const pokemonStore = usePokemonStore();

const searchText = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

watch(searchText, (newSearchText) => {
  pokemonStore.setSearchText(newSearchText);
  pokemonStore.updateFilteredPokemon();
});

watch(itemsPerPage, (newItemsPerPage) => {
  pokemonStore.setItemsPerPage(newItemsPerPage);
});

watch(currentPage, (newPage) => {
  pokemonStore.setPage(newPage);
});

</script>

<template>
  <v-container>
    <v-row class="my-4 d-flex align-center mt-10">
      <v-col cols="12" md="6">
        <v-text-field v-model="searchText" label="Buscar Pokémon" variant="outlined" clearable prefix-icon="mdi-magnify"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-text-field v-model="itemsPerPage" label="Número total de Pokémon a mostrar" variant="outlined"
          type="number" prefix-icon="mdi-numeric"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.my-4 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.v-text-field {
  width: 100%;
}

/* Ajusta según tus preferencias */
</style>
