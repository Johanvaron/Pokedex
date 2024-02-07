// Importa la función defineStore de Pinia para crear un almacén similar a Vuex
import { defineStore } from 'pinia';

// Importa Axios para realizar solicitudes HTTP
import axios from 'axios';

// Define el tipo para los datos de Pokémon
type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
  };
  description: string;
  types: {
    type: { name: string; url: string };
  }[];
  abilities: {
    ability: { name: string; url: string };
  }[];
  stats: {
    stat: { name: string; url: string };
    base_stat: number;
  }[];
};

// Crea un almacén Pinia para gestionar el estado, getters y acciones relacionados con Pokémon
export const usePokemonStore = defineStore('pokemon', {
  // Estado inicial para el almacén
  state: () => ({
    pokemonsWithDetails: [] as Pokemon[],  // Lista para almacenar detalles de Pokémon
    showModal: false,  // Bandera para controlar la visibilidad del modal
    selectedPokemon: null as Pokemon | null,  // Pokémon actualmente seleccionado para detalles
    filteredPokemon: [] as Pokemon[],  // Lista de Pokémon después de aplicar filtros
    searchText: '',  // Texto utilizado para filtrar Pokémon por nombre
    currentPage: 1,  // Número de página actual para la paginación de la lista de Pokémon
    itemsPerPage: 15,  // Número de Pokémon a mostrar por página
  }),

  // Getters para propiedades calculadas basadas en el estado
  getters: {
    // Calcula el número total de páginas basado en la lista de Pokémon filtrados y itemsPerPage
    totalPages: (state) => Math.ceil(state.filteredPokemon.length / state.itemsPerPage),
    // Obtiene la lista actual de Pokémon en función de la página actual y itemsPerPage
    currentPokemonList: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.filteredPokemon.slice(start, end);
    },
  },

  // Acciones para realizar operaciones asíncronas y modificar el estado
  actions: {
    // Obtiene datos de Pokémon de una API externa
    async fetchPokemonData() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonList = await Promise.all(response.data.results.map(async (pokemon: any) => {
          const detailsResponse = await axios.get(pokemon.url);
          const speciesResponse = await axios.get(detailsResponse.data.species.url);
          const descriptionEntry = speciesResponse.data.flavor_text_entries.find((entry: any) => entry.language.name === 'en'); // Ajustar a 'es' para español si es necesario

          return {
            name: detailsResponse.data.name,
            sprites: detailsResponse.data.sprites,
            description: descriptionEntry ? descriptionEntry.flavor_text : 'No hay descripción disponible',
            types: detailsResponse.data.types,
            abilities: detailsResponse.data.abilities.map((ability: any) => ({
              ability: { name: ability.ability.name, url: ability.ability.url },
            })),
            stats: detailsResponse.data.stats.map((stat: any) => ({
              stat: { name: stat.stat.name, url: stat.stat.url },
              base_stat: stat.base_stat,
            })),
          };
        }));

        this.pokemonsWithDetails = pokemonList;
        this.updateFilteredPokemon();
      } catch (error) {
        console.error('Error al obtener datos de Pokémon:', error);
      }
    },

    // Muestra los detalles de un Pokémon específico
    showPokemonDetails(pokemonName: string) {
      const pokemon = this.pokemonsWithDetails.find((p) => p.name === pokemonName);
      if (pokemon) {
        this.selectedPokemon = pokemon;
        this.showModal = true;
      }
    },

    // Actualiza la lista de Pokémon filtrados según el texto de búsqueda
    updateFilteredPokemon() {
      if (this.searchText) {
        this.filteredPokemon = this.pokemonsWithDetails.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
      } else {
        this.filteredPokemon = this.pokemonsWithDetails;
      }
      this.currentPage = 1; // Reinicia a la primera página después de actualizar el filtro
    },

    // Establece el número de página actual
    setPage(pageNumber: number) {
      this.currentPage = pageNumber;
    },

    // Establece la cantidad de elementos a mostrar por página
    setItemsPerPage(number: number) {
      this.itemsPerPage = number;
      this.updateFilteredPokemon();
    },

    // Establece el texto de búsqueda y actualiza la lista de Pokémon filtrados
    setSearchText(text: string) {
      this.searchText = text;
      this.updateFilteredPokemon();
    },

    // Avanza a la siguiente página de la lista de Pokémon
    goNext() {
      console.log('Llamando a goNext');
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        console.log('Nueva página actual:', this.currentPage);
        this.updateFilteredPokemon();
      }
    },
    
    // Retrocede a la página anterior de la lista de Pokémon
    goBack() {
      console.log('Llamando a goBack');
      if (this.currentPage > 1) {
        this.currentPage--;
        console.log('Nueva página actual:', this.currentPage);
        this.updateFilteredPokemon();
      }
    },
  },
});
