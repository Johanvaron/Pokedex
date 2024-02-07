<script>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import TheFilterAndPagination from './TheFilterAndPagination.vue';

export default {
  name: 'Pokedex',
  components: {
    TheFilterAndPagination,
  },
  setup() {
    const pokemonsWithDetails = ref([]);
    const showModal = ref(false);
    const selectedPokemon = ref({});
    const filteredPokemon = ref([]);
    const itemsPerPage = ref(15);
    const currentPage = ref(0);
    const searchText = ref('');
    const totalPages = computed(() => Math.ceil(pokemonsWithDetails.value.length / itemsPerPage.value));

    onMounted(async () => {
      await fetchPokemonData();
    });

    async function fetchPokemonData() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonList = response.data.results;

        for (const pokemon of pokemonList) {
          const detailsResponse = await axios.get(pokemon.url);
          const speciesResponse = await axios.get(detailsResponse.data.species.url);
          const descriptionEntry = speciesResponse.data.flavor_text_entries.find(
            entry => entry.language.name === 'es'
          );

          const abilities = await Promise.all(
            detailsResponse.data.abilities.map(async ability => {
              const abilityResponse = await axios.get(ability.ability.url);
              return {
                name: abilityResponse.data.names.find(name => name.language.name === 'es').name
              };
            })
          );

          const stats = detailsResponse.data.stats.map(stat => ({
            stat: { name: stat.stat.name },
            base_stat: stat.base_stat
          }));

          const newPokemon = {
            name: detailsResponse.data.name,
            sprites: detailsResponse.data.sprites,
            description: descriptionEntry ? descriptionEntry.flavor_text : 'No description available',
            types: detailsResponse.data.types,
            abilities: abilities,
            stats: stats
          };

          pokemonsWithDetails.value.push(newPokemon);
        }

        updateFilteredPokemon();
      } catch (error) {
        console.error(error);
      }
    }

    function showPokemonDetails(pokemonName) {
      const pokemon = pokemonsWithDetails.value.find(p => p.name === pokemonName);
      if (pokemon) {
        selectedPokemon.value = pokemon;
        showModal.value = true;
      }
    }

    function goNext() {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
        updateFilteredPokemon();
      }
    }

    function goBack() {
      if (currentPage.value > 0) {
        currentPage.value--;
        updateFilteredPokemon();
      }
    }

    function updateItemsPerPage(newItemsPerPage) {
      itemsPerPage.value = newItemsPerPage;
      currentPage.value = 0;
      updateFilteredPokemon();
    }

    function filterPokemons() {
      const searchTextLower = searchText.value.toLowerCase();
      filteredPokemon.value = pokemonsWithDetails.value
        .filter(pokemon => pokemon.name.toLowerCase().includes(searchTextLower))
        .slice(0, itemsPerPage.value);
    }

    function updateFilteredPokemon() {
      const startIndex = currentPage.value * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      const searchTextLower = searchText.value.toLowerCase();
      filteredPokemon.value = pokemonsWithDetails.value
        .filter(pokemon => pokemon.name.toLowerCase().includes(searchTextLower))
        .slice(startIndex, endIndex);
    }

    watch(searchText, filterPokemons);
    watch(itemsPerPage, updateItemsPerPage);

    return {
      pokemonsWithDetails,
      showModal,
      selectedPokemon,
      filteredPokemon,
      itemsPerPage,
      currentPage,
      searchText,
      totalPages,
      showPokemonDetails,
      goNext,
      goBack,
      updateFilteredPokemon
    };
  }
};
</script>

<template>
  <v-container class="pokedex-container">
    <v-img class="left-image"></v-img>

    <!-- Fila para el selector de cantidad de Pokémon a mostrar y el buscador -->
    <FilterAndPagination
            :pokemonList="pokemonsWithDetails" 
            @update-items-per-page="updateItemsPerPage"
            @update-filtered-pokemon="updateFilteredPokemon"
        />

    <!-- Lista de Pokémon filtrados -->
    <v-row justify="center">
      <v-col v-for="(pokemon, index) in filteredPokemon" :key="index" cols="12" sm="6" md="4">
        <v-card class="mb-4 pokemon-card" @click="showPokemonDetails(pokemon.name)" elevation="12">
          <v-img :src="pokemon.sprites.front_default" height="150" class="rounded-top"></v-img>
          <v-card-title class="text-center font-weight-bold">
            {{ pokemon.name }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="text-center">
            <v-chip-group>
              <v-chip v-for="(type, index) in pokemon.types" :key="index" class="type-chip" color="accent">
                {{ type.type.name }}
              </v-chip>
            </v-chip-group>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botones para navegar entre Pokémon -->
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="6">
        <v-btn @click="goBack" color="primary" block :disabled="currentPage === 0">Atrás</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="goNext" color="primary" block :disabled="currentPage === totalPages - 1">Siguiente</v-btn>
      </v-col>
    </v-row>

    <!-- Modal para mostrar detalles del Pokémon -->
    <v-dialog v-model="showModal" max-width="600">
      <v-card class="pokemon-details">
        <v-img :src="selectedPokemon.sprites.front_default" height="200" class="rounded-top"></v-img>
        <v-card-title class="text-center font-weight-bold">
          {{ selectedPokemon.name }}
        </v-card-title>
        <v-card-text class="pokemon-info">
          <div v-if="selectedPokemon.description" class="mb-3">
            <h3 class="mb-1">Descripción:</h3>
            <p>{{ selectedPokemon.description }}</p>
          </div>
          <div v-if="selectedPokemon.types && selectedPokemon.types.length" class="mb-3">
            <h3 class="mb-1">Tipos:</h3>
            <v-chip-group>
              <v-chip v-for="(type, index) in selectedPokemon.types" :key="index" class="type-chip" color="accent">
                {{ type.type.name }}
              </v-chip>
            </v-chip-group>
          </div>
          <div v-if="selectedPokemon.abilities && selectedPokemon.abilities.length" class="mb-3">
            <h3 class="mb-1">Habilidades:</h3>
            <v-chip-group>
              <v-chip v-for="(ability, index) in selectedPokemon.abilities" :key="index" class="ability-chip"
                color="success">
                {{ ability.name }}
              </v-chip>
            </v-chip-group>
          </div>
          <div v-if="selectedPokemon.stats && selectedPokemon.stats.length">
            <h3 class="mb-1">Estadísticas:</h3>
            <v-row v-for="(stat, index) in selectedPokemon.stats" :key="index" class="mb-1">
              <v-col cols="4" class="text-right">{{ stat.stat.name }}:</v-col>
              <v-col cols="8" class="text-left">{{ stat.base_stat }}</v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="close-button" color="accent" text @click="showModal = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.pokedex-container {
  background-color: #c7eafa;
}
.pokemon-card {
  width: 250px;
  margin: auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease-in-out;
  border: 2px solid #000000;
}
.pokemon-card:hover {
  transform: scale(1.05);
}

.rounded-top {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.v-card-title {
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
  color: #333;
  transition: color 0.3s ease-in-out;
}
.pokemon-card:hover .v-card-title {
  color: #d81c5b;
}.v-chip 
{
  font-family: 'Press Start 2P', cursive;
  margin: 5px;
  transition: background-color 0.3s ease-in-out;
}

.pokemon-card:hover .v-chip {
  background-color: #333;
}

.v-dialog .v-card {
  border-radius: 15px;
  transition: transform 0.3s ease-in-out;
  background-color: #409be6;
  box-shadow: 0px 0px 20px 0px rgba(160, 37, 37, 0.5);
}

.v-dialog:hover .v-card {
  transform: scale(1.05);
}

.v-dialog .v-card-title {
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  font-weight: bold;
  transition: color 0.3s ease-in-out;
  color: white;
}

.v-dialog:hover .v-card-title {
  color: #333;
}

.v-dialog .v-card-subtitle,
.v-dialog .v-card-text {
  font-family: 'Arial', sans-serif;
  color: white;
}

.v-dialog .v-chip {
  font-family: 'Press Start 2P', cursive;
  background-color: white;
  color: #d81c5b;
}

.left-image,
.right-image {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Estilos adicionales para el modal mejorado */
.pokemon-details {
  border-radius: 15px;
  transition: transform 0.3s ease-in-out;
  background-color: #409be6;
  box-shadow: 0px 0px 20px 0px rgba(160, 37, 37, 0.5);
}

.pokemon-details:hover {
  transform: scale(1.05);
}

.pokemon-info {
  font-family: 'Arial', sans-serif;
  color: white;
}

.type-chip,
.ability-chip,
.close-button {
  font-family: 'Press Start 2P', cursive;
  color: white;
  transition: color 0.3s ease-in-out;
}

.close-button:hover {
  color: #333;
}
</style>
