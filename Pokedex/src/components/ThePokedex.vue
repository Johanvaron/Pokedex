<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePokemonStore } from '../store/pokemonstore';

const pokemonStore = usePokemonStore();
const searchText = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

onMounted(() => {
  if (pokemonStore.pokemonsWithDetails.length === 0) {
    pokemonStore.fetchPokemonData();
  }
});

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < getMaxPage()) {
    currentPage.value++;
  }
};

const getMaxPage = () => {
  return Math.ceil(pokemonStore.filteredPokemon.length / itemsPerPage.value);
};

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
  <v-container class="pokedex-container">
    <v-row>
      <v-col cols="12" sm="6" md="4" class="text-center" :key="pokemon.name"
        v-for="pokemon in pokemonStore.currentPokemonList">
        <v-hover v-slot="{ isHovering, props }">
          <v-card class="mx-auto bordered rounded-lg bg-white" variant="outlined"
            :max-width="isHovering ? '320':'260'" 
            :height="isHovering ? 320:270" 
            :elevation="isHovering ? 8:2"
            v-bind="props">

            <v-img :src="pokemon.sprites.front_default" class="white--text align-end rounded-top" >
              <v-card-title class="v-card-title">{{ pokemon.name }}</v-card-title>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row justify="center" class="buttons-row">
      <v-col>
        <v-btn block size="large" @click="goToPreviousPage" color="blue" class="ma-2 v-btn--large">Regresar</v-btn>
      </v-col>
      <v-col>
        <v-btn block size="large" @click="goToNextPage" color="blue" class="ma-2 v-btn--large">Siguiente</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>



<style scoped>
.pokedex-container {
  background-color: #c7eafa;
}

.buttons-row {
  margin-top: 20px;
}
</style>
